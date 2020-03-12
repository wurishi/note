using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
using Entitas.CodeGeneration.Attributes;

[Input, Unique]
public class LeftMouseComponent : IComponent {}

[Input, Unique]
public class RightMouseComponent : IComponent {}

[Input]
public class MouseDownComponent : IComponent
{
    public Vector2 position;
}

[Input]
public class MousePositionComponent : IComponent
{
    public Vector2 position;
}

[Input]
public class MouseUpComponent : IComponent
{
    public Vector2 position;
}

[Input, Unique]
public class LogPositionComponent : IComponent
{
}