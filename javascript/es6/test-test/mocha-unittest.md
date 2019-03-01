## mocha单元测试简单说明

`mocha`是用于`JavaScript`单元测试的库，相比`Nodejs`自带的单元测试更易用更全面，并且`BDD`和`TDD`测试都是支持的，异步测试也是支持的。

### 安装
  - `npm install mocha`，不建议全局安装
### 来个完整而简单的范例
  - 创建目录:`mkdir test-test`，用来存放我们的本次完整的测试项目
  - 创建目录:`mkdir test-src`，用来存放我们要测试测代码
  - 创建目录:`mkdir test`，用来存放我们的测试用例代码，这个目录要注意下，mocha默认执行这下面的代码，所以目录名不要改
  - 编写一个简单的接口用来测试:`vim test-src/mysum.js`
    ```javascript
	module.exports = function (...rest) {
	    var sum = 0;
	    for (let n of rest) {
		sum += n;
	    }
	    return sum;
	};
    ```
  - 编写一个测试用例:`vim test/test.js`
    ```javascript
	const assert = require('assert');

	const sum = require('../test-src/mysum');

	describe('#mysum.js', () => {

		describe('#sum()', () => {
			it('sum() should return 0', () => {
			    assert.strictEqual(sum(), 0);
			});

			it('sum(1) should return 1', () => {
			    assert.strictEqual(sum(1), 1);
			});

			it('sum(1, 2) should return 3', () => {
			    assert.strictEqual(sum(1, 2), 3);
			});

			it('sum(1, 2, 3) should return 6', () => {
			    assert.strictEqual(sum(1, 2, 3), 6);
			});
		});
	});
    ```
### 运行测试用例
  - 可以使用:`./node_modules/mocha/bin/mocha`:
  ```shell
  #mysum.js
      #sum()
        ✓ sum() should return 0
        ✓ sum(1) should return 1
        ✓ sum(1, 2) should return 3
        ✓ sum(1, 2, 3) should return 6
    4 passing (18ms)
  ```

  - 也可以用配置文件，创建:`vim package.json`
  ```json
  {
  	"scripts":{
  		"test": "mocha"
  	}
  }
  ```
  - 运行:`npm test`
  ```shell
  > @ test /mnt/g/ormosiaVM/github/JavaScript/javascript/es6/test-test
  > mocha
  ```

```shell
  #mysum.js
    #sum()
      ✓ sum() should return 0
      ✓ sum(1) should return 1
      ✓ sum(1, 2) should return 3
      ✓ sum(1, 2, 3) should return 6
  4 passing (18ms)
```

在测试前初始化资源，测试后释放资源是非常常见的。mocha提供了before、after、beforeEach和afterEach来实现这些功能

查看官方文档看更多内容https://mochajs.org/