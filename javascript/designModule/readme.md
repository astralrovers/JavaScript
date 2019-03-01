# 学习设计模式

这里的设计模式是基于JavaScript，不过设计模式是一种方法、思想，不区分语言，只是实现问题。

另外，我同时也是一名C程序员，所以也会考虑C语言当中如何实现。

## 单例模式

### 定义：

**保证一个类仅有一个实例，并提供一个访问它的全局访问点。**

**解释**：

也就是说定义了一个类，但是这个类只能创建一个实例，这个实例只要被创建出来那就是唯一的，而且以后任何地方使用这个类来创建一个实例返回的都是之前创建的那个实例，而且这个实例在全局范围内都是可以访问的。

### 应用场景

当我们的程序中只需要一个用来表示特殊含义和用途的对象时就可以使用单例模式来保证该对象无论在何时都只会被创建一次，它的值在程序中的任何地方使用修改都是同步的。比如线程池、windows对象、登录窗和登录状态等等都是唯一的，全局同步的。代表的某个唯一事物的当前描述。

### 例子

```javascript
class Singletion {
    constructor(name) {
        this.name = name;
    }
}

function createAdmin(name) {
    if (!Singletion.instance) {
        // 将实例绑定到类上面，就可以通过类来获取是否已经创建该类实例的标志
        Singletion.instance = new Singletion(name);
    }
    return Singletion.instance; 
}

let admin1 = createAdmin("js");
let admin2 = createAdmin("node");

console.log(admin1 === admin2);
console.log("admin1 : ", admin1.name);
console.log("admin2 : ", admin2.name);
```

结果

```shell
true
admin1 :  js
admin2 :  js
```

C语言版：

```c
  #include <stdio.h>
  #include <stdbool.h>
  #include <stdlib.h>

  static char *create_admin(char *name) {
      static bool is_created = false;  // 使用一个静态变量来表示创建标志
      static char *admin = NULL;		// 保留创建对象
      if (!is_created) {
          admin = (char *)malloc(20);
          sprintf(admin, "%s", name);
          is_created = true;
      }
      return admin;
  }

  int main(int argc, char** argv) {
      char *admin1 = create_admin("javascript");
      char *admin2 = create_admin("c language");
      printf("%s\n", (admin1 == admin2) ? "true" : "false");
      printf("admin1 %s\n", admin1);
      printf("admin2 %s\n", admin2);
      return 0;
  }
/*
true
admin1 javascript
admin2 javascript
*/
```





不过这种模式去创建一个单例并不是特别理想，使用`new`关键字去创建实例会让人只管感受到得到的是一个实例，而不用像上边这种方式去关心函数的返回值是啥。

```javascript
class Singletion {
    constructor(name) {
        // 在构造函数里面讲实例绑定到类上
        if (!Singletion.instance) {
            this.name = name;
            Singletion.instance = this;
        }
        return Singletion.instance;
    }

    printName() {
        console.log(this.name);
    }
}

let admin1 = new Singletion("js");
let admin2 = new Singletion("node");

console.log(admin1 === admin2);
console.log("admin1 : ", admin1.name);
console.log("admin2 : ", admin2.name);

admin1.printName();
admin2.printName();
```

结果：

```shell
true
admin1 :  js
admin2 :  js
js
js
```

### 其他实现方式

但是有时候我们需要的可能并不是类实例，而是一个普通的对象，那么最简单的方式就是定义一个全局变量，然后定义一组访问它的接口。

```javascript
let admin = {
    _name : 'js',
    setName : (name) => {
        this._name = name;
    },
    getName : () => {
        return this._name;
    }
};
```

这样的话我们就只需要操作`admin`这个全局变量就好了。

C语言版:

```c
#include <stdio.h>

static char admin_name[20] = "admin";

static void set_admin_name(char *name) {
    sprintf(admin_name, "%s", name);
}

static char *get_admin_name(void) {
    return admin_name;
}

int main(int args, char** argv) {
    set_admin_name("javascript");
    printf("%s\n", get_admin_name());
    return 0;
}
```



但是呢我们应该避免过多地使用全局变量，应该更多地使用接口，这样对于代码维护是非常好的，因为相对来说数据和操作都是在一个整体里面的。

对于一些只读变量我们除了使用`const`表示，还可以使用闭包，来看看实现：

```JavaScript
let adminName = (function Singletion(name) {
    return () => {
        return name;
    };
})("javascript");

console.log(adminName()); // javascript
```

这样的话我们就只有一个接口。