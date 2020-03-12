using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
public class Chapter3Feature : Feature
{
    public Chapter3Feature(Contexts contexts) : base("Chapter3Feature")
    {
        Add(new EmitInputSystem(contexts));
    }
}
