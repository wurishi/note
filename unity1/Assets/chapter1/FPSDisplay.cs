using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(FPSCounter))]
public class FPSDisplay : MonoBehaviour
{
    [System.Serializable]
    private struct FPSColor
    {
        public Color color;
        public int minimumFPS;
    }
    private static string[] stringsFrom00To99;

    [SerializeField]
    private FPSColor[] coloring;
    
    public Text averageFPSLabel;
    public Text highestFPSLabel;
    public Text lowestFPSLabel;

    private FPSCounter fpsCounter;

    private void Awake()
    {
        if (null == stringsFrom00To99)
        {
            stringsFrom00To99 = new string[100];
            for (int i = 0; i < stringsFrom00To99.Length; i++)
            {
                if (i < 10)
                {
                    stringsFrom00To99[i] = "0" + i;
                }
                else
                {
                    stringsFrom00To99[i] = i.ToString();
                }
            }
        }
        fpsCounter = GetComponent<FPSCounter>();
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        // 每次会造成30B的GC Alloc
        // fpsLabel.text = Mathf.Clamp(fpsCounter.AverageFPS, 0, 99).ToString();
        // averageFPSLabel.text = stringsFrom00To99[Mathf.Clamp(fpsCounter.AverageFPS, 0, 99)];
        // highestFPSLabel.text = stringsFrom00To99[Mathf.Clamp(fpsCounter.HighestFPS, 0, 99)];
        // lowestFPSLabel.text = stringsFrom00To99[Mathf.Clamp(fpsCounter.LowestFPS, 0, 99)];
        Display(averageFPSLabel, fpsCounter.AverageFPS);
        Display(highestFPSLabel, fpsCounter.HighestFPS);
        Display(lowestFPSLabel, fpsCounter.LowestFPS);
    }

    void Display(Text label, int fps)
    {
        label.text = stringsFrom00To99[Mathf.Clamp(fps, 0, 99)];
        for (int i = 0; i < coloring.Length; i++)
        {
            if (fps >= coloring[i].minimumFPS)
            {
                label.color = coloring[i].color;
                break;
            }
        }
    }
}
