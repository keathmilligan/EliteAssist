﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EliteAssistHotKeys
{
    internal class HotKey
    {
        string Name { get; set; }
        Keys Keys { get; set; }
    }

    internal class HotKeys
    {
        //private static readonly Keys IncrementKeys = Keys.Control | Keys.Alt | Keys.Up;
        //private static readonly Keys DecrementKeys = Keys.Control | Keys.Alt | Keys.Down;

        //public MainForm()
        //{
        //    InitializeComponent();
        //    //var kc = new KeysConverter();
        //    //Debug.WriteLine(kc.ConvertToString(Keys.F1));
        //    //Debug.WriteLine(kc.ConvertToString(IncrementKeys));
        //    //Keys k = (Keys)kc.ConvertFromString("Ctrl+Alt+Up");
        //    //Debug.WriteLine(k);
        //    //Debug.WriteLine(kc.ConvertToString(k));
        //    HotkeyManager.Current.AddOrReplace("Increment", IncrementKeys, OnIncrement);
        //    HotkeyManager.Current.AddOrReplace("Decrement", DecrementKeys, OnDecrement);
        //}

        //private void OnIncrement(object sender, HotkeyEventArgs e)
        //{
        //    Debug.WriteLine("increment");
        //}

        //private void OnDecrement(object sender, HotkeyEventArgs e)
        //{
        //    Debug.WriteLine("decrement");
        //}

        //private void OnFormLoad(object sender, System.EventArgs e)
        //{
        //    Form form = (Form)sender;
        //    form.ShowInTaskbar = false;
        //    form.Opacity = 0;
        //}

        private HotKey[] Assignments = new HotKey[0];
        
        HotKeys()
        {
        }
    }
}
