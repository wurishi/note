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

# 2D 灯光

1. 在 Window / Package Manager 中找到 Lightweight RP 包并安装。
2. 在 Project 中找一个目录创建 Rendering -> Universal Render Pipeline -> Pipeline Asset 和 2D Renderer。
3. 选择之前创建的 Pipeline Asset ，在 Inspector 窗口中的 General 选项里面为 Renderer List 里面的第一项指定一个 ScriptableRendererData (就是指向上面创建的 2D Renderer)。
4. 在 Edit / Project Settings 中找到 Graphics 面板，指定 Scriptable Render Pipeline Settings 为第2步创建的 Pipeline Asset。
5. 所有场景中的 Renderer 的 Material 应该全部指向 Sprite-Lit-Default。可以通过菜单 Edit / Render Pipeline / Universal Render Pipeline / 2D Renderer 下批量修改。
6. 接下来可能通过创建 Light -> 2D 创建 2D 灯光。
7. 除了 Global Light 外，其他灯光都可以使用法线贴图，通过 Inspector 窗口勾选上 Use Normal Map。
8. 然后用 Sprite Editor 修改贴图，左上角菜单选择 Secondary Textures，添加一张法线帖图，Name 必须为 _NormalMap（可以通过下拉列表选择）。

# 法线贴图的生成

## 方法一

使用 SpriteIlluminator 类工具生成。

## 方法二

Ctrl + D 复制一张 Texture，在 Inspector 窗口中选择 Texture Type 为 Normal map。另外可以勾选上 Create from Grayscale，调整法线。