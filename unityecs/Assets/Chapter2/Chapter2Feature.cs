using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Entitas;
public class Chapter2Feature : Feature
{
    public Chapter2Feature(Contexts contexts) : base("Chapter2Feature")
    {
        Add(new LogMouseClickSystem(contexts));
        Add(new DebugMessageSystem(contexts));
        Add(new HelloWorldSystem(contexts));
        Add(new CleanupDebugMessageSystem(contexts));
        Add(new ShowMessageToTextSystem(contexts));
    }
}
