using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;

public class Chapter1Feature : Feature
{
    public Chapter1Feature(Contexts contexts) : base("Chapter1Feature")
    {
        Add(new DebugMessageSystem(contexts));
        Add(new HelloWorldSystem(contexts));
    }
}
