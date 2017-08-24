<style scoped lang="less">
  @import "../assets/css/home.less";
</style>
<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Form-item label="标题" prop="title">
      <Input v-model="formValidate.title" placeholder="请输入标题"></Input>
    </Form-item>
    <Form-item label="描述" prop="content">
      <Input v-model="formValidate.content" placeholder="请输入描述"></Input>
    </Form-item>
    <Form-item label="URL" prop="url">
      <Input v-model="formValidate.url" placeholder="请输入URL"></Input>
    </Form-item>
    <Form-item label="选择分类" prop="category">
      <Select v-model="formValidate.category" placeholder="选择分类">
        <Option value="1">前端</Option>
        <Option value="2">后端</Option>
        <Option value="3">数据库</Option>
        <Option value="4">其他</Option>
      </Select>
    </Form-item>

    <Form-item label="理由" prop="reason">
      <Input v-model="formValidate.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
    </Form-item>

    <Form-item label="你是谁？" prop="user">
      <Input v-model="formValidate.user" placeholder="你是谁？"></Input>
    </Form-item>
    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
    </Form-item>
  </Form>
</template>
<script>
  export default {
    data () {
        return {
          formValidate: {
              title: '',
              content: '',
              url: '',
              category: '',
              reason: '',
              user: ''
          },
          ruleValidate: {
              title: [
                  {required: true, message: '标题不能为空', trigger: 'blur'}
              ],
              content: [
                  {required: true, message: '描述不能为空', trigger: 'blur'}
              ],
              url: [
                  {required: true, message: 'url不能为空', trigger: 'blur'}
              ],
              category: [
                  {required: true, message: '请选择一个分类', trigger: 'change'}
              ],
              reason: [
                  {required: true, message: '写个理由来让别人知道？', trigger: 'blur'}
              ],
              user: [
                  {required: true, message: '写下自己的名字/昵称让别人知道你', trigger: 'blur'}
              ]
          }
        }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.$http.post('/week', this.formValidate)
                .then((res) => {
                    alert('感谢推荐');
                    window.location.href = '/'
                })
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
  }
</script>
