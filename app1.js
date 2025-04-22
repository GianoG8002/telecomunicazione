var MaxVariableCount=4;
var VariableNames1 = Array("A","B","C","D");
var Width1  = Array(0,2,2,4,4);
var Height1 = Array(0,2,2,2,4);
var BitOrder1 = Array(0,1,3,2);
var AllowDontCare1=false;
var DontCare1 = "X";

var TruthTable1 = Array();
var KMap1 = Array();
var Equation1 = Array();
var FunctionText1 = "";
var EquationHighlightColor1 = "#f3c256";
var Heavy1 = 20;

var TTDiv1 = "TruthTableDiv1"
var EDiv1 = "EquationDiv1"
var KDiv1 = "KarnoMapDiv1"

for (i=0; i<Math.pow(2,MaxVariableCount); i++)
{
	Equation1[i] = new Array();
	Equation1[i].ButtonUIName = "EQ1" + i;
	Equation1[i].Expression = "";
	Equation1[i].Rect = null;
	Equation1.UsedLength=0;
}

Equation1.UsedLength=1;
Equation1[0].Expression="0";

function InitializeTables1()
{
	TruthTable1 = new Array();
	KMap1 = new Array();							

	VariableCount1 = 4;
	KMap1.Width1=Width1[VariableCount1];
	KMap1.Height1=Height1[VariableCount1];

	for (i=0; i<Math.pow(2,VariableCount1); i++)
	{
		TruthTable1[i] = new Array();
		TruthTable1[i].Index = i;
		TruthTable1[i].Name = i.toString(2);
		TruthTable1[i].ButtonUIName = "TT1"+TruthTable1[i].Name;
		TruthTable1[i].TTROWUIName = "TTROW1" + TruthTable1[i].Name;
		for (j=0; j<Math.pow(2,VariableCount1); j++)
		{
			TruthTable1[i][j] = new Array();
			TruthTable1[i][j].Variable = (i & (1<<(VariableCount1-(1+j)))?1:0)?true:false;
			TruthTable1[i][j].Name = VariableNames1[j];
			TruthTable1[i][j].KMapEntry = null;
		}
	}

	KMap1.XVariables = KMap1.Width1/2;
	KMap1.YVariables = KMap1.Height1/2;

	for (w=0; w<KMap1.Width1; w++)
	{
		KMap1[w]=new Array();
		for (h=0; h<KMap1.Height1; h++)
		{
			KMap1[w][h]=new Array();
			KMap1[w][h].Value = false;
			mapstr2 = BinaryString(BitOrder1[w],KMap1.XVariables) + BinaryString(BitOrder1[h],KMap1.YVariables);
			mapval1 = parseInt(mapstr2,2);
			KMap1[w][h].TruthTableEntry = TruthTable1[mapval1];
			KMap1[w][h].TruthTableEntry.KMapEntry = KMap1[w][h];
			KMap1[w][h].ButtonUIName = "KM1" + KMap1[w][h].TruthTableEntry.Name;
			KMap1[w][h].TDUIName = "TD1" + KMap1[w][h].TruthTableEntry.Name;
			KMap1[w][h].Covered = false;
			KMap1[w][h].Variable = new Array();
			for (i=0; i<VariableCount1; i++)
			{
				KMap1[w][h].Variable[i] = KMap1[w][h].TruthTableEntry[i].Variable;
			}
		}
	}

	FunctionText1 = "Funzione(";
	for (i=0; i<VariableCount1; i++)
	{
		FunctionText1 += VariableNames1[i];
	}
	FunctionText1+=")<br>";
}

function HighlightColor1( Value )
{
	if (Value=="1") return "#c85a3c";
	if (Value=="0") return "#00c396";
	return "gray";
}

function RectHighlightColor1()
{
	return EquationHighlightColor1;
}

setTimeout(() => {
	if (typeof ChangeVariableNumber1 === "function") {
	  ChangeVariableNumber1();
	} else {
	  console.error("app1's function not found!");
	}
}, 1000);

function CreateRect1( x,y,w,h )
{
	var Obj=new Array();
	Obj.x = x;
	Obj.y = y;
	Obj.w = w;
	Obj.h = h;
	return Obj;
}

function Compare1( Value1, Value2 )
{
	if ( (Value1 == Value2) || (Value1==DontCare1) || (Value2==DontCare1) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

function TestRect1( Rect, TestValue )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			var Test = KMap1[(Rect.x+dx)%KMap1.Width1][(Rect.y+dy)%KMap1.Height1].Value;
			if (!Compare1(TestValue,Test))
			{
				return false;
			}
		}
	}
	return true;
}

function IsCovered1( Rect )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			if (!KMap1[(Rect.x+dx)%KMap1.Width1][(Rect.y+dy)%KMap1.Height1].Covered) 
			{
				if (!(KMap1[(Rect.x+dx)%KMap1.Width1][(Rect.y+dy)%KMap1.Height1].Value==DontCare1))
				{
					return false;
				}
			}
		}
	}
	return true;
}

function Cover1( Rect, IsCovered )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			KMap1[(Rect.x+dx)%KMap1.Width1][(Rect.y+dy)%KMap1.Height1].Covered = IsCovered;
		}
	}
}

function SearchRect1( w,h, TestValue, Found, DoCover )
{
	if ((w>KMap1.Width1) || (h>KMap1.Height1))
	{
		return;
	}
		
	var x=0;
	var y=0;
	var across = (KMap1.Width1==w) ?1:KMap1.Width1;
	var down   = (KMap1.Height1==h)?1:KMap1.Height1;
	for (x=0; x<across; x++)
	{
		for (y=0; y<down; y++)
		{
			var Rect = CreateRect1(x,y,w,h);
			if (TestRect1(Rect,TestValue))
			{
				if (!IsCovered1(Rect))
				{
					Found[Found.length]=Rect;
					if (DoCover) Cover1(Rect, true);
				}
			}
		}
	}
}

function TryRects1(Rects1,Used)
{
    var j = 0;
    for (j = 0; j < Rects1.length; j++)
    {
        var Rect = Rects1[j];
        if (TestRect1(Rect, true))
        {
            if (!IsCovered1(Rect))
            {
                Used[Used.length] = Rect;
                Cover1(Rect, true);
            }
        }
    }
}

function AddRectWeight1(Weights, Rect, Weight)
{
    var dx = 0;
    var dy = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            Weights[(Rect.x + dx) % KMap1.Width1][(Rect.y + dy) % KMap1.Height1] += Weight;
        }
    }
}

function GetRectWeight1(Weights, Rect)
{
    var dx = 0;
    var dy = 0;
    var W = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            W += Weights[(Rect.x + dx) % KMap1.Width1][(Rect.y + dy) % KMap1.Height1];
        }
    }
    return W;
}

function SortByWeight1(a, b)
{
    if (a.Weight < b.Weight) return -1;
    else if (a.Weight > b.Weight) return 1;
    else return 0;
}

function OverlappingRects1(R1,R2)
{
    if ( (R1.x+R1.w>R2.x) && 
         ((R2.x+R2.w)>(R1.x)) &&
         (R1.y+R1.h>R2.y) && 
         ((R2.y+R2.h)>(R1.y))
        )
        return true;
    return false;
}

function FindBestCoverage1(Rects1,AllRects)
{
    var Weights = new Array();
    for (w = 0; w < KMap1.Width1; w++)
    {
        Weights[w] = new Array();
        for (h = 0; h < KMap1.Height1; h++)
        {
            Weights[w][h] = (KMap1[w][h].Covered)?Heavy1:0;
        }
    }

    var i = 0;
    for (i = 0; i < Rects1.length; i++)
    {
        AddRectWeight1(Weights, Rects1[i], 1);
    }

    var SortedRects = new Array();
    while (Rects1.length>0)
    {
        var j=0;
        for (j = 0; j < Rects1.length; j++)
        {
            Rects1[j].Weight = GetRectWeight1(Weights, Rects1[j]);
        }
        
        Rects1.sort(SortByWeight1);
        SortedRects.push(Rects1[0]);
        if (Rects1.length == 1)
        {
            break;
        }
        
        AddRectWeight1(Weights, Rects1[0], Heavy1);
        
        for (j=0; j< Rects1.length; j++)
        {
            if (OverlappingRects1(Rects1[0], Rects1[j]))
            {
                AddRectWeight1(Weights, Rects1[j], -1);
            }
        }
        
        Rects1 = Rects1.slice(1);
    }
    
    TryRects1(SortedRects, AllRects);
}

function Search1()
{
    var Rects1 = new Array();
    Cover1(CreateRect1(0, 0, KMap1.Width1, KMap1.Height1), false);
    
    SearchRect1(4, 4, true, Rects1, true);
    SearchRect1(4, 2, true, Rects1, true);
    SearchRect1(2, 4, true, Rects1, true);
    SearchRect1(1, 4, true, Rects1, true);
    SearchRect1(4, 1, true, Rects1, true);
    SearchRect1(2, 2, true, Rects1, true);
    
    var Rects2x1 = new Array();
    SearchRect1(2, 1, true, Rects2x1, false);
    SearchRect1(1, 2, true, Rects2x1, false);
    FindBestCoverage1(Rects2x1, Rects1);

    SearchRect1(1, 1, true, Rects1, true);

    Cover1(CreateRect1(0, 0, KMap1.Width1, KMap1.Height1), false);
    for (i = Rects1.length - 1; i >= 0; i--)
    {
        if (IsCovered1(Rects1[i]))
        {
            Rects1[i] = null;
        }
        else
        {
            Cover1(Rects1[i], true);
        }
    }
	
	ClearEquation1();	
	for (i=0;i<Rects1.length; i++)
	{
		if (Rects1[i]!=null)
		{
			RectToEquation1(Rects1[i]);
		}
	}
	if (Equation1.UsedLength==0)
	{
		Equation1.UsedLength=1;
		Equation1[0].Expression="0";
		Equation1[0].Rect = CreateRect1(0,0,KMap1.Width1,KMap1.Height1);
	}
}

function ClearEquation1()
{
	for (i=0; i<Equation1.length; i++)
	{
		Equation1[i].Rect	= null;
	}
	Equation1.UsedLength=0;
}

function IsConstantVariable1( Rect, Variable )
{
	var dx=0;
	var dy=0;
	var topleft = KMap1[Rect.x][Rect.y].Variable[Variable];
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			test = KMap1[(Rect.x+dx)%KMap1.Width1][(Rect.y+dy)%KMap1.Height1].Variable[Variable];
			if (test!=topleft)
			{
				return false;
			}
		}
	}
	return true;
}

function RectToEquation1( Rect )
{
	var Text = "";
	var i=0;
	for (i=0; i<VariableCount1; i++)
	{
		if (IsConstantVariable1( Rect, i))
		{
			if (!KMap1[Rect.x][Rect.y].Variable[i])
			{
				Text += "<span style='text-decoration: overline'>"+VariableNames1[i]+"</span> ";
			}
			else
			{
				Text += VariableNames1[i] + " ";
			}
		}
	}
	if (Text.length==0)
	{
		Text="1";
	}
	Equation1[Equation1.UsedLength].Rect  = Rect;
	Equation1[Equation1.UsedLength].Expression = Text;
	Equation1.UsedLength++;
	
	return Text;
}

function DisplayValue1( bool )
{
	if (bool==true)
	{
		return "1";
	}
	else if (bool==false)
	{
		return "0";
	}
	else return DontCare1;
}

function BinaryString1( value, bits )
{
	var str = value.toString(2);
	var i=0;
	for (i=0; i<bits; i++)
	{
		if (str.length<bits)
		{
			str = "0" + str;
		}
	}
	return str;
}

function UpdateUI1()
{
    var i = 0;
    for (i = 0; i < TruthTable1.length; i++)
    {
        var Val = DisplayValue1(TruthTable1[i].KMapEntry.Value);
  
        SetValue1(TruthTable1[i].ButtonUIName, Val);
        SetBackgroundColor1(TruthTable1[i].ButtonUIName, HighlightColor1(Val));
        SetBackgroundColor1(TruthTable1[i].TTROWUIName, HighlightColor1(Val));

        SetValue1(TruthTable1[i].KMapEntry.ButtonUIName, Val);
        SetBackgroundColor1(TruthTable1[i].KMapEntry.ButtonUIName, HighlightColor1(Val));
        SetBackgroundColor1(TruthTable1[i].KMapEntry.TDUIName, HighlightColor1(Val));
    }
    SetInnerHTML1(EDiv1, GenerateEquationHTML1());
}
	
function ToggleValue1( Value )
{
	if (AllowDontCare1)
	{
		if (Value==true)
		{
			return DontCare1;
		}
		else if (Value==DontCare1)
		{
			return false;
		}
		else if (Value==false)
		{
			return true;
		}
	}
	else
	{
		return !Value;
	}
}

function ToggleTTEntry1( TTEntry1 )
{
	TTEntry1.KMapEntry.Value = ToggleValue1(TTEntry1.KMapEntry.Value);
	RefreshUI1();
}

function ToggleKMEntry1( KMEntry1 )
{
	KMEntry1.Value = ToggleValue1(KMEntry1.Value);
	RefreshUI1();
}

function RefreshUI1()
{
	ClearEquation1();
	Search1();
	UpdateUI1();
}

function SetShowRect1( EquationEntry, EquationIndex )
{	
	if (EquationEntry==null)
	{
		UpdateUI1();
		return;
	}
	else
	{
	    var ShowRect = EquationEntry.Rect;

	    var dx = 0;
        var dy = 0;
        for (dx = 0; dx < ShowRect.w; dx++)
        {
            for (dy = 0; dy < ShowRect.h; dy++)
            {
                var KMEntry1 = KMap1[(ShowRect.x + dx) % KMap1.Width1][(ShowRect.y + dy) % KMap1.Height1];
                var Val = DisplayValue1(TruthTable1[i].KMapEntry.Value);
                
                SetBackgroundColor1(KMEntry1.ButtonUIName, RectHighlightColor1(Val));
                SetBackgroundColor1(KMEntry1.TDUIName, RectHighlightColor1(Val));
                
                SetBackgroundColor1(KMEntry1.TruthTableEntry.ButtonUIName, RectHighlightColor1(Val));
                SetBackgroundColor1(KMEntry1.TruthTableEntry.TTROWUIName, RectHighlightColor1(Val));
            }
        }
	}
	SetBackgroundColor1(Equation1[EquationIndex].ButtonUIName,EquationHighlightColor1);
}

function GetElement1(Name)
{
	if (document.getElementById)
	{
		return document.getElementById(Name);
	}
	else if (document.all)
	{
		return document.all[Name];
	}
	else if (document.layers)
	{
		return document.layers[Name]
	}
}

function SetInnerHTML1(Name,Text)
{
	GetElement1(Name).innerHTML = Text
}

function SetBackgroundColor1(Name,Color)
{
	GetElement1(Name).style.backgroundColor = Color;
}

function SetValue1(Name,Value)
{
	GetElement1(Name).value = Value;
}

function GenerateTruthTableHTML1()
{
	var Text = "<table ID=\"TruthTableID1\" style=\"text-align:center;width:100%;\">";
	{
		Text = Text + "<thead style=\"background: gainsboro; text-align:center;\"><tr>";
		Text = Text + "<th>"+FunctionText1+"</th></tr></thead>";
			
		for (i=0; i<TruthTable1.length; i++)
		{
			if (i % 2 == 0)
			{ 
				var count = 0.85;
			}else{
				var count = 0.8;
			}

			Text += "<tr ID='"+TruthTable1[i].TTROWUIName+"' style=\"opacity: " +count+ "\">";
			Text = Text
				+ "<td><input ID=\""+TruthTable1[i].ButtonUIName +"\" name="+TruthTable1[i].ButtonUIName +" type='button' value='"+DisplayValue1(TruthTable1[i].KMapEntry.Value)+"' onClick=\"ToggleTTEntry1(TruthTable1["+i+"])\" style=\"width: 100%; border: none;\" ></td>" 
				+ "</tr>";
		}
	}
	Text = Text + "</table>";
	return Text;
}

function GenerateKarnoMapHTML1()
{
	var Text = "<table style='width: 100%; height: 100%'><thead><tr>";
	var h,w;
	Text = Text + "<th colspan=\"2\" ></th><th style=\"background: gainsboro;border-bottom:2px solid rgb(31, 39, 55)\" colspan="+(KMap1.Width1)+">";

	for (i=0; i<KMap1.XVariables; i++)
	{
		Text += VariableNames1[i];
	}
	
	Text += "</th></tr></thead>";
	Text += "<tbody><tr>";
	Text += "<th ></th><th style=\"border-left: none !important\"></th>";

	for (i=0; i<KMap1.Width1; i++)
	{
		Text += "<th class=\"header-color\" style=\"background: gainsboro\">"+BinaryString1(BitOrder1[i],KMap1.XVariables)+"</th>";
	}
	Text+="</tr>";
	
	for (h=0; h<KMap1.Height1; h++)
	{
		if (h % 2 != 0)
		{ 
			var count = 0.85;
		}else{
			var count = 0.8;
		}
		if (h==0)
		{
			Text += "<th style=\"background: gainsboro; width: 15%\" rowspan="+((KMap1.Height1) + 2)  +">";
			for (i=0; i<KMap1.YVariables; i++)
			{
				Text += "<b class=\"header-color\">" + VariableNames1[i+KMap1.XVariables] + "</b>";
			}
		}
		Text += "<th class=\"header-color\" style=\"border-left: 2px solid black;background: gainsboro;width: 15%\" >"+BinaryString1(BitOrder1[h],KMap1.YVariables)+"</th>";

		for (w=0; w<KMap1.Width1; w++)
		{

			Text += "<td  ID='"+KMap1[w][h].TDUIName+"' style='text-align:center;'>"
					+ "<input ID="+KMap1[w][h].ButtonUIName +" name="+KMap1[w][h].ButtonUIName +" type='button'  value='"+DisplayValue1(KMap1[w][h].Value)+"' onClick=\"ToggleKMEntry1(KMap1["+w+"]["+h+"])\" style=\"width: 100%; height: 100%; border: none;\">"
					+ "</td>";
		}
		Text += "</tr>";
	}
	Text +="</td></tr></tbody></table>";
	return Text;
}


function GenerateEquationHTML1()
{
	var j;
	var i;
	for (i=0; i<Equation1.UsedLength; )
	{
		var Text = "<p class=\"header-color remove-bottom\">";
		for (j=0; (j < 8) && (i<Equation1.UsedLength); j++)
		{
			if (i==0) Text+= "<b>"+FunctionText1;
			Text += "<span class=\"blue button half-bottom\" id=\""+Equation1[i].ButtonUIName + "\" onMouseOver=\"SetShowRect1(Equation1["+i+"],"+i+");\" onMouseOut=\"SetShowRect1(null);\" style=\"padding:5px\">";
			Text += "<b>" + Equation1[i].Expression + "</span>";
			if (i<Equation1.UsedLength-1) Text +=" <span> + </span>";
			i++;
		}	
		Text += "</p>"
	}
	return Text;
}

function ChangeVariableNumber1()
{
	InitializeTables1();
	ClearEquation1();
	SetInnerHTML1(TTDiv1,GenerateTruthTableHTML1());
	SetInnerHTML1(KDiv1,GenerateKarnoMapHTML1());
	SetInnerHTML1(EDiv1,GenerateEquationHTML1());
	Search1();
	UpdateUI1();
}

function ToggleDontCare1()
{
	AllowDontCare1=!AllowDontCare1;
	var i=0;
	for (i=0;i<TruthTable1.length; i++)
	{
		if (TruthTable1[i].KMapEntry.Value==DontCare1)
		{
			TruthTable1[i].KMapEntry.Value=false;
		}
	}
	ChangeVariableNumber1(VariableCount1);
	GetElement1("AllowDontCareCB").checked = AllowDontCare1;
}

function PageParameter1( Name )
{
	var Regex = new RegExp( "[\\?&]"+Name+"=([^&#]*)" );
	var Results = Regex.exec( window.location.href );
	if( Results != null )
	{
		return Results[1];
	}
	return "";
}

function Init1()
{
	SetInnerHTML1(KDiv1, GenerateKarnoMapHTML1());
	SetInnerHTML1(EDiv1, GenerateEquationHTML1());
	SetInnerHTML1(TTDiv1, GenerateTruthTableHTML1());
}