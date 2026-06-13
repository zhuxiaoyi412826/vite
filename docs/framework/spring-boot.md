# Spring Boot 快速上手

Spring Boot 是基于 Spring 框架的**快速开发脚手架**，通过约定大于配置的理念，让开发者能够"开箱即用"地构建独立的、生产级的 Spring 应用。

## 核心特性

- **自动装配**：根据 classpath 自动配置 Bean
- **起步依赖**：通过 starter 简化 Maven 配置
- **内嵌服务器**：Tomcat / Jetty，无需部署 WAR
- **健康检查**：开箱即用的 actuator 端点

## 快速创建项目

访问 [https://start.spring.io/](https://start.spring.io/) 选择：

- Project: **Maven**
- Language: **Java**
- Spring Boot: **3.x**
- Dependencies: **Spring Web**

下载并导入 IDE 即可。

## 项目结构

```text
src/
├── main/
│   ├── java/
│   │   └── com.example.demo/
│   │       ├── DemoApplication.java     # 启动类
│   │       ├── controller/
│   │       │   └── UserController.java
│   │       ├── service/
│   │       │   └── UserService.java
│   │       └── entity/
│   │           └── User.java
│   └── resources/
│       ├── application.yml
│       └── static/
└── test/
```

## 第一个 REST 接口

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping
    public List<User> list() {
        return List.of(
            new User(1L, "Alice", 20),
            new User(2L, "Bob",   22)
        );
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return new User(id, "User-" + id, 18);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        // 实际业务中会调用 service 持久化
        return user;
    }
}
```

启动 `DemoApplication` 即可访问 `http://localhost:8080/users`。

## 常用注解

| 注解 | 作用 |
| ---- | ---- |
| `@SpringBootApplication` | 启动类标志 |
| `@RestController` | REST 控制器（= `@Controller` + `@ResponseBody`） |
| `@RequestMapping` | 路由映射 |
| `@GetMapping` / `@PostMapping` | 限定方法类型 |
| `@PathVariable` | 路径参数 |
| `@RequestParam` | 查询参数 |
| `@RequestBody` | 请求体 |
| `@Autowired` / `@Resource` | 依赖注入 |
| `@Service` / `@Repository` / `@Component` | 标记 Bean |

## 配置文件

`application.yml` 示例：

```yaml
server:
  port: 8080

spring:
  application:
    name: demo
  datasource:
    url: jdbc:mysql://localhost:3306/school
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    root: info
    com.example: debug
```

## 整合 MyBatis

```xml
<!-- pom.xml -->
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>3.0.3</version>
</dependency>
```

```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);
}
```

## 整合 Redis

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```java
@Autowired
private StringRedisTemplate redisTemplate;

public void save() {
    redisTemplate.opsForValue().set("name", "Alice", Duration.ofHours(1));
}
```

## 统一异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public Result handle(Exception e) {
        return Result.fail(e.getMessage());
    }
}
```

## 过滤器 / 拦截器

### 拦截器

```java
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req,
                             HttpServletResponse res,
                             Object handler) {
        // 鉴权逻辑
        return true;
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/login");
    }
}
```

## 打包与部署

```bash
# 打包为可执行 jar
mvn clean package -DskipTests

# 运行
java -jar target/demo-0.0.1-SNAPSHOT.jar

# 后台运行
nohup java -jar demo.jar > app.log 2>&1 &
```

## 常用 Starter 依赖

| Starter | 作用 |
| ------- | ---- |
| `spring-boot-starter-web` | Web 开发 |
| `spring-boot-starter-data-jpa` | JPA 持久化 |
| `spring-boot-starter-data-redis` | Redis |
| `spring-boot-starter-security` | 安全 |
| `spring-boot-starter-test` | 测试 |
| `spring-boot-starter-actuator` | 健康检查 |

## 小结

Spring Boot 已成为 Java 后端开发的事实标准。掌握自动装配原理、常用 starter 和整合方式，足以应对大部分企业级项目。
