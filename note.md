# Unity 打包 Android 如果卡在 gradle 阶段。

## 方法一

可以尝试修改 Unity 安装目录(如：Unitys\2019.2.0f1\Editor\Data\PlaybackEngines\AndroidPlayer\Tools\GradleTemplates)下的所有有repositories语句的文件，增加阿里提供的仓库地址：

```
maven{ url 'http://maven.aliyun.com/nexus/content/groups/public/'}
```

类似如下：

```
    repositories {**ARTIFACTORYREPOSITORY**
        maven{ url 'http://maven.aliyun.com/nexus/content/groups/public/'}
        google()
        jcenter()
    }
```

## 方法二

下载好的gradle插件会存储在 **C:\Users\Administrator\.gradle\wrapper\dists**， 可以尝试指定 gradle 版本。（可以先在 gradle 官网下载好对应版本）

```
dependencies {
	classpath 'com.android.tools.build:gradle:3.3.0'
}
```

