<template>
  <el-card 
    class="box-card" 
    v-loading="loading">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" font-size="24px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input 
          placeholder="请输入内容" 
          class="searchInput"
          v-model="searchVal">
          <el-button 
            @click="checkUser()"
            slot="append" 
            icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="addUserForm">添加用户</el-button>
      </el-col>
    </el-row>
      <!-- 添加用户的弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="formdata">
        <el-form-item label="用户姓名">
          <el-input v-model="formdata.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

      <!-- 编辑用户的弹框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormEdituser">
      <el-form :model="formdata">
        <el-form-item label="用户姓名">
          <el-input disabled v-model="formdata.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdituser = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormRole">
      <el-form :model="formdata">
        <el-form-item label="用户姓名">
          {{currUserName}}
        </el-form-item>

        <el-form-item label="角色">
           <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="(item, index) in roles"
              :key="index"
              :label="item.roleName"
              :value="item.id">
            </el-option>
           </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRole = false">取 消</el-button>
        <el-button type="primary" @click="roleUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="140">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="140">
      </el-table-column>
      <!-- 使用过滤器 -->
      <el-table-column label="创建日期"  width="120">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="changeSwitchMgstate(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="editUserForm(scope.row.id)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="open(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          <el-button @click="roleUserForm(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      <!-- sizes:每页显示的页数   next：下一页-->
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      // 加载动画
      loading: false,
      // 分页相关属性
      total:0,
      pagesize: 2,
      pagenum: 1,
      // 当前页
      currentPage: 1,
      // 查询关键字
      searchVal: '',
      // 添加用户
      formdata:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      dialogFormVisible: false,
      dialogFormEdituser: false,
      dialogFormRole: false,
      roles: [],
      currUserName: '',
      currRoleId: -1,
      //当前用户id
      currUserId: -1
    }
  },
  created () {
    this.loadTableData ()
  },
  methods: {
    //分配角色
     async roleUser () { 
        const res = await this.$http.put(`users/${this.currUserId}/role`, {rid:this.currRoleId})
        console.log(res)
        //提示修改成功
        const {meta:{msg, status}} = res.data
        if(status === 200){
          this.$message.success(msg)
          this.dialogFormRole=false
        }
        //关闭对话框
        
        this.currRoleId = -1
      },
    //弹出分配表单
       async roleUserForm (user) {
        this.dialogFormRole=true
        this.currUserName = user.username
        const res = await this.$http.get('roles')
        console.log(res)
        this.roles = res.data.data
        const res2 = await this.$http.get(`users/${user.id}`)
        this.currRoleId = res2.data.data.rid
      },
    //编辑用户
    async editUser () {
      const res = await this.$http.put(`users/${this.formdata.id}`, this.formdata)
      console.log(res) 
      this.dialogFormEdituser=false
      this.loadTableData()
      this.$message.success(res.data.meta.msg)
    },
    //弹出编辑用户表单
      async editUserForm (userId) {
        this.dialogFormEdituser=true
        const res = await this.$http.get(`users/${userId}`)
        console.log(res)
        this.formdata = res.data.data
      },
    //删除用户
      open (id) {
        this.$confirm('sure', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`users/${id}`)
          console.log(res)
          const {meta:{msg, status}} = res.data
          if (status === 200) {
            this.$message({
            type: 'success',
            message: msg
            });
          this.loadTableData()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    // 添加用户
      async addUser () {
        const res = await this.$http.post('users', this.formdata)
        console.log(res)
        this.loadTableData()
        this.dialogFormVisible = false
        this.formdata={}
      },
    // 弹出添加用户表单
     addUserForm () {
       this.dialogFormVisible= true  
      },
    // 改变用户状态
      async changeSwitchMgstate (user) {
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        console.log(res)

      },
    // 查询用户
     checkUser () {
       this.loadTableData()
      },

    // 登录到用户管理页面后请求后台用户信息
      async loadTableData() {
        //请求数据成功之前出现加载动画
        this.loading = true

        // 除了登录功能，其他功能的接口需要加入token才能请求
        // 给 header 增加token
        const AUTH_TOKEN = sessionStorage.getItem('token')
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        const res = await this.$http.get(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
        // 获取页面总数
        // console.log(res)
        this.total = res.data.data.total
        const {meta:{msg, status}, data:{users}} = res.data
        if ( status === 200 ) {
          this.list = users

          //表格渲染完成后 关闭加载动画效果
          this.loading = false

          //需要重新页面，否则搜索第2页以后的数据就会搜索不到
          this.pagenum = 1
          //重置下面两行后不会有效果
          // this.pagesize = 2
          // this.currentPage =1
        }
      },
    // 分页函数
      handleSizeChange (val) {
        // console.log(`每页展示${val}条数据`)
        this.pagesize = val
        this.loadTableData()

      },
      handleCurrentChange (val) {
        //点击后将pagenum的值修改为当前页
        this.pagenum = val
        this.loadTableData()
        // console.log(`当前页${val}`)
      }
    }
  };
</script>

<style>
.box-card {
  height:100%;
}
  .searchArea {
    margin: 20px 0;
  }
  .searchArea .searchInput {
    width: 350px;
  }
</style>
