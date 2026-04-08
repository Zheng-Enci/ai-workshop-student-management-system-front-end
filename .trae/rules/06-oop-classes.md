# 面向对象编程规范

# 类文件规范
所有 .js 和 .ts 文件必须使用类（Class）进行面向对象编程
禁止使用函数式编程或纯函数方式组织代码

# 类定义原则
类名：PascalCase
文件名：PascalCase + .ts/.js 后缀
例如：UserService.ts | ImageCropper.ts

# 类的结构
class ClassName {
    // 私有属性
    private propertyName: type

    // 保护属性
    protected propertyName: type

    // 公共属性
    public propertyName: type

    // 构造函数
    constructor(params) {
    }

    // 公共方法
    public methodName(): returnType {
    }

    // 私有方法
    private methodName(): returnType {
    }

    // 保护方法
    protected methodName(): returnType {
    }

    // 静态方法
    public static staticMethodName(): returnType {
    }
}

# 模块导出
使用 export default 导出类
例如：export default class ClassName { }

# 依赖注入
类的方法应该使用类实例而不是直接依赖
通过构造函数注入依赖
