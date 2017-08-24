reg=--registry=https://registry.npm.taobao.org

install:
	npm install $(reg)

# 开发环境编译
dev:
	gulp dev
# 生产环境
prod: install
	gulp prod

# 测试环境
test: install
	git pull
	gulp prod
	pm2 reload rms_test

# 文档生成
doc:
	apidoc -i server/api/v1 -o /home/q/apidoc/rms-node
	echo 'http://doc.rms.brandwisdom.cn'
	esdoc -c ./esdoc.json
	echo 'http://esdoc.rms.brandwisdom.cn'
