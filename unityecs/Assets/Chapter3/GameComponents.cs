using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

[Game]
public class PositionComponent : IComponent
{
    public Vector2 value;
}

[Game]
public class DirectionComponent : IComponent
{
    public float value;
}

[Game]
public class ViewComponent : IComponent
{
    public GameObject gameObject;
}

[Game]
public class SpriteComponent : IComponent
{
    public string name;
}

[Game]
public class MoverComponent : IComponent
{
    
}

[Game]
public class MoveComponent : IComponent
{
    public Vector2 target;
}

[Game]
public class MoveCompleteComponent : IComponent {}