var MaxVariableCount=4;
var VariableNames2 = Array("E","F","G","H");
var Width2  = Array(0,2,2,4,4);
var Height2 = Array(0,2,2,2,4);
var BitOrder2 = Array(0,1,3,2);
var AllowDontCare2=false;
var DontCare2 = "X";

var TruthTable2 = Array();
var KMap2 = Array();
var Equation2 = Array();
var FunctionText2 = "";
var EquationHighlightColor2 = "#f3c256";
var Heavy2 = 20;

var TTDiv2 = "TruthTableDiv2"
var EDiv2 = "EquationDiv2"
var KDiv2 = "KarnoMapDiv2"

for (i=0; i<Math.pow(2,MaxVariableCount); i++)
{
	Equation2[i] = new Array();
	Equation2[i].ButtonUIName = "EQ2" + i;
	Equation2[i].Expression = "";
	Equation2[i].Rect = null;
	Equation2.UsedLength=0;
}

Equation2.UsedLength=1;
Equation2[0].Expression="0";

function InitializeTables2()
{
	TruthTable2 = new Array();
	KMap2 = new Array();							

	VariableCount2 = 4;
	KMap2.Width2=Width2[VariableCount2];
	KMap2.Height2=Height2[VariableCount2];

	for (i=0; i<Math.pow(2,VariableCount2); i++)
	{
		TruthTable2[i] = new Array();
		TruthTable2[i].Index = i;
		TruthTable2[i].Name = i.toString(2);
		TruthTable2[i].ButtonUIName = "TT2"+TruthTable2[i].Name;
		TruthTable2[i].TTROWUIName = "TTROW2" + TruthTable2[i].Name;
		for (j=0; j<Math.pow(2,VariableCount2); j++)
		{
			TruthTable2[i][j] = new Array();
			TruthTable2[i][j].Variable = (i & (1<<(VariableCount2-(1+j)))?1:0)?true:false;
			TruthTable2[i][j].Name = VariableNames2[j];
			TruthTable2[i][j].KMapEntry = null;
		}
	}

	KMap2.XVariables = KMap2.Width2/2;
	KMap2.YVariables = KMap2.Height2/2;

	for (w=0; w<KMap2.Width2; w++)
	{
		KMap2[w]=new Array();
		for (h=0; h<KMap2.Height2; h++)
		{
			KMap2[w][h]=new Array();
			KMap2[w][h].Value = false;
			mapstr2 = BinaryString(BitOrder2[w],KMap2.XVariables) + BinaryString(BitOrder2[h],KMap2.YVariables);
			mapval1 = parseInt(mapstr2,2);
			KMap2[w][h].TruthTableEntry = TruthTable2[mapval1];
			KMap2[w][h].TruthTableEntry.KMapEntry = KMap2[w][h];
			KMap2[w][h].ButtonUIName = "KM2" + KMap2[w][h].TruthTableEntry.Name;
			KMap2[w][h].TDUIName = "TD2" + KMap2[w][h].TruthTableEntry.Name;
			KMap2[w][h].Covered = false;
			KMap2[w][h].Variable = new Array();
			for (i=0; i<VariableCount2; i++)
			{
				KMap2[w][h].Variable[i] = KMap2[w][h].TruthTableEntry[i].Variable;
			}
		}
	}

	FunctionText2 = "Funzione(";
	for (i=0; i<VariableCount2; i++)
	{
		FunctionText2 += VariableNames2[i];
	}
	FunctionText2+=")<br>";
}

function HighlightColor( Value )
{
	if (Value=="1") return "#c85a3c";
	if (Value=="0") return "#00c396";
	return "gray";
}

function RectHighlightColor()
{
	return EquationHighlightColor2;
}

setTimeout(() => {
	if (typeof ChangeVariableNumber2 === "function") {
	  ChangeVariableNumber2();
	} else {
	  console.error("app2's function not found!");
	}
}, 2000);

function CreateRect( x,y,w,h )
{
	var Obj=new Array();
	Obj.x = x;
	Obj.y = y;
	Obj.w = w;
	Obj.h = h;
	return Obj;
}

function Compare( Value1, Value2 )
{
	if ( (Value1 == Value2) || (Value1==DontCare2) || (Value2==DontCare2) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

function TestRect( Rect, TestValue )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			var Test = KMap2[(Rect.x+dx)%KMap2.Width2][(Rect.y+dy)%KMap2.Height2].Value;
			if (!Compare(TestValue,Test))
			{
				return false;
			}
		}
	}
	return true;
}

function IsCovered( Rect )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			if (!KMap2[(Rect.x+dx)%KMap2.Width2][(Rect.y+dy)%KMap2.Height2].Covered) 
			{
				if (!(KMap2[(Rect.x+dx)%KMap2.Width2][(Rect.y+dy)%KMap2.Height2].Value==DontCare2))
				{
					return false;
				}
			}
		}
	}
	return true;
}

function Cover( Rect, IsCovered )
{
	var dx=0;
	var dy=0;
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			KMap2[(Rect.x+dx)%KMap2.Width2][(Rect.y+dy)%KMap2.Height2].Covered = IsCovered;
		}
	}
}

function SearchRect( w,h, TestValue, Found, DoCover )
{
	if ((w>KMap2.Width2) || (h>KMap2.Height2))
	{
		return;
	}
		
	var x=0;
	var y=0;
	var across = (KMap2.Width2==w) ?1:KMap2.Width2;
	var down   = (KMap2.Height2==h)?1:KMap2.Height2;
	for (x=0; x<across; x++)
	{
		for (y=0; y<down; y++)
		{
			var Rect = CreateRect(x,y,w,h);
			if (TestRect(Rect,TestValue))
			{
				if (!IsCovered(Rect))
				{
					Found[Found.length]=Rect;
					if (DoCover) Cover(Rect, true);
				}
			}
		}
	}
}

function TryRects(Rects2,Used)
{
    var j = 0;
    for (j = 0; j < Rects2.length; j++)
    {
        var Rect = Rects2[j];
        if (TestRect(Rect, true))
        {
            if (!IsCovered(Rect))
            {
                Used[Used.length] = Rect;
                Cover(Rect, true);
            }
        }
    }
}

function AddRectWeight(Weights, Rect, Weight)
{
    var dx = 0;
    var dy = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            Weights[(Rect.x + dx) % KMap2.Width2][(Rect.y + dy) % KMap2.Height2] += Weight;
        }
    }
}

function GetRectWeight(Weights, Rect)
{
    var dx = 0;
    var dy = 0;
    var W = 0;
    for (dx = 0; dx < Rect.w; dx++)
    {
        for (dy = 0; dy < Rect.h; dy++)
        {
            W += Weights[(Rect.x + dx) % KMap2.Width2][(Rect.y + dy) % KMap2.Height2];
        }
    }
    return W;
}

function SortByWeight(a, b)
{
    if (a.Weight < b.Weight) return -1;
    else if (a.Weight > b.Weight) return 1;
    else return 0;
}

function OverlappingRects(R1,R2)
{
    if ( (R1.x+R1.w>R2.x) && 
         ((R2.x+R2.w)>(R1.x)) &&
         (R1.y+R1.h>R2.y) && 
         ((R2.y+R2.h)>(R1.y))
        )
        return true;
    return false;
}

function FindBestCoverage(Rects2,AllRects)
{
    var Weights = new Array();
    for (w = 0; w < KMap2.Width2; w++)
    {
        Weights[w] = new Array();
        for (h = 0; h < KMap2.Height2; h++)
        {
            Weights[w][h] = (KMap2[w][h].Covered)?Heavy2:0;
        }
    }

    var i = 0;
    for (i = 0; i < Rects2.length; i++)
    {
        AddRectWeight(Weights, Rects2[i], 1);
    }

    var SortedRects = new Array();
    while (Rects2.length>0)
    {
        var j=0;
        for (j = 0; j < Rects2.length; j++)
        {
            Rects2[j].Weight = GetRectWeight(Weights, Rects2[j]);
        }
        
        Rects2.sort(SortByWeight);
        SortedRects.push(Rects2[0]);
        if (Rects2.length == 1)
        {
            break;
        }
        
        AddRectWeight(Weights, Rects2[0], Heavy2);
        
        for (j=0; j< Rects2.length; j++)
        {
            if (OverlappingRects(Rects2[0], Rects2[j]))
            {
                AddRectWeight(Weights, Rects2[j], -1);
            }
        }
        
        Rects2 = Rects2.slice(1);
    }
    
    TryRects(SortedRects, AllRects);
}

function Search()
{
    var Rects2 = new Array();
    Cover(CreateRect(0, 0, KMap2.Width2, KMap2.Height2), false);
    
    SearchRect(4, 4, true, Rects2, true);
    SearchRect(4, 2, true, Rects2, true);
    SearchRect(2, 4, true, Rects2, true);
    SearchRect(1, 4, true, Rects2, true);
    SearchRect(4, 1, true, Rects2, true);
    SearchRect(2, 2, true, Rects2, true);
    
    var Rects2x1 = new Array();
    SearchRect(2, 1, true, Rects2x1, false);
    SearchRect(1, 2, true, Rects2x1, false);
    FindBestCoverage(Rects2x1, Rects2);

    SearchRect(1, 1, true, Rects2, true);

    Cover(CreateRect(0, 0, KMap2.Width2, KMap2.Height2), false);
    for (i = Rects2.length - 1; i >= 0; i--)
    {
        if (IsCovered(Rects2[i]))
        {
            Rects2[i] = null;
        }
        else
        {
            Cover(Rects2[i], true);
        }
    }
	
	ClearEquation();	
	for (i=0;i<Rects2.length; i++)
	{
		if (Rects2[i]!=null)
		{
			RectToEquation(Rects2[i]);
		}
	}
	if (Equation2.UsedLength==0)
	{
		Equation2.UsedLength=1;
		Equation2[0].Expression="0";
		Equation2[0].Rect = CreateRect(0,0,KMap2.Width2,KMap2.Height2);
	}
}

function ClearEquation()
{
	for (i=0; i<Equation2.length; i++)
	{
		Equation2[i].Rect	= null;
	}
	Equation2.UsedLength=0;
}

function IsConstantVariable( Rect, Variable )
{
	var dx=0;
	var dy=0;
	var topleft = KMap2[Rect.x][Rect.y].Variable[Variable];
	for (dx=0; dx<Rect.w; dx++)
	{
		for (dy=0; dy<Rect.h; dy++)
		{
			test = KMap2[(Rect.x+dx)%KMap2.Width2][(Rect.y+dy)%KMap2.Height2].Variable[Variable];
			if (test!=topleft)
			{
				return false;
			}
		}
	}
	return true;
}

function RectToEquation( Rect )
{
	var Text = "";
	var i=0;
	for (i=0; i<VariableCount2; i++)
	{
		if (IsConstantVariable( Rect, i))
		{
			if (!KMap2[Rect.x][Rect.y].Variable[i])
			{
				Text += "<span style='text-decoration: overline'>"+VariableNames2[i]+"</span> ";
			}
			else
			{
				Text += VariableNames2[i] + " ";
			}
		}
	}
	if (Text.length==0)
	{
		Text="1";
	}
	Equation2[Equation2.UsedLength].Rect  = Rect;
	Equation2[Equation2.UsedLength].Expression = Text;
	Equation2.UsedLength++;
	
	return Text;
}

function DisplayValue( bool )
{
	if (bool==true)
	{
		return "1";
	}
	else if (bool==false)
	{
		return "0";
	}
	else return DontCare2;
}

function BinaryString( value, bits )
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

function UpdateUI2()
{
    var i = 0;
    for (i = 0; i < TruthTable2.length; i++)
    {
        var Val = DisplayValue(TruthTable2[i].KMapEntry.Value);
  
        SetValue(TruthTable2[i].ButtonUIName, Val);
        SetBackgroundColor(TruthTable2[i].ButtonUIName, HighlightColor(Val));
        SetBackgroundColor(TruthTable2[i].TTROWUIName, HighlightColor(Val));

        SetValue(TruthTable2[i].KMapEntry.ButtonUIName, Val);
        SetBackgroundColor(TruthTable2[i].KMapEntry.ButtonUIName, HighlightColor(Val));
        SetBackgroundColor(TruthTable2[i].KMapEntry.TDUIName, HighlightColor(Val));
    }
    SetInnerHTML(EDiv2, GenerateEquationHTML2());
}
	
function ToggleValue( Value )
{
	if (AllowDontCare2)
	{
		if (Value==true)
		{
			return DontCare2;
		}
		else if (Value==DontCare2)
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

function ToggleTTEntry( TTEntry )
{
	TTEntry.KMapEntry.Value = ToggleValue(TTEntry.KMapEntry.Value);
	RefreshUI2();
}

function ToggleKMEntry( KMEntry )
{
	KMEntry.Value = ToggleValue(KMEntry.Value);
	RefreshUI2();
}

function RefreshUI2()
{
	ClearEquation();
	Search();
	UpdateUI2();
}

function SetShowRect( EquationEntry, EquationIndex )
{	
	if (EquationEntry==null)
	{
		UpdateUI2();
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
                var KMEntry = KMap2[(ShowRect.x + dx) % KMap2.Width2][(ShowRect.y + dy) % KMap2.Height2];
                var Val = DisplayValue(TruthTable2[i].KMapEntry.Value);
                
                SetBackgroundColor(KMEntry.ButtonUIName, RectHighlightColor(Val));
                SetBackgroundColor(KMEntry.TDUIName, RectHighlightColor(Val));
                
                SetBackgroundColor(KMEntry.TruthTableEntry.ButtonUIName, RectHighlightColor(Val));
                SetBackgroundColor(KMEntry.TruthTableEntry.TTROWUIName, RectHighlightColor(Val));
            }
        }
	}
	SetBackgroundColor(Equation2[EquationIndex].ButtonUIName,EquationHighlightColor2);
}

function GetElement(Name)
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

function SetInnerHTML(Name,Text)
{
	GetElement(Name).innerHTML = Text
}

function SetBackgroundColor(Name,Color)
{
	GetElement(Name).style.backgroundColor = Color;
}

function SetValue(Name,Value)
{
	GetElement(Name).value = Value;
}

function GenerateTruthTableHTML2()
{
	var Text = "<table ID=\"TruthTableID2\" style=\"text-align:center;width:100%;\">";
	{
		Text = Text + "<thead style=\"background: gainsboro; text-align:center;\"><tr>";
		Text = Text + "<th>"+FunctionText2+"</th></tr></thead>";
			
		for (i=0; i<TruthTable2.length; i++)
		{
			if (i % 2 == 0)
			{ 
				var count = 0.85;
			}else{
				var count = 0.8;
			}

			Text += "<tr ID='"+TruthTable2[i].TTROWUIName+"' style=\"opacity: " +count+ "\">";
			Text = Text
				+ "<td><input ID=\""+TruthTable2[i].ButtonUIName +"\" name="+TruthTable2[i].ButtonUIName +" type='button' value='"+DisplayValue(TruthTable2[i].KMapEntry.Value)+"' onClick=\"ToggleTTEntry(TruthTable2["+i+"])\" style=\"width: 100%; border: none;\" ></td>" 
				+ "</tr>";
		}
	}
	Text = Text + "</table>";
	return Text;
}

function GenerateKarnoMapHTML2()
{
	var Text = "<table style='width: 100%; height: 100%'><thead><tr>";
	var h,w;
	Text = Text + "<th colspan=\"2\" ></th><th style=\"background: gainsboro;border-bottom:2px solid rgb(31, 39, 55)\" colspan="+(KMap2.Width2)+">";

	for (i=0; i<KMap2.XVariables; i++)
	{
		Text += VariableNames2[i];
	}
	
	Text += "</th></tr></thead>";
	Text += "<tbody><tr>";
	Text += "<th ></th><th style=\"border-left: none !important\"></th>";

	for (i=0; i<KMap2.Width2; i++)
	{
		Text += "<th class=\"header-color\" style=\"background: gainsboro\">"+BinaryString(BitOrder2[i],KMap2.XVariables)+"</th>";
	}
	Text+="</tr>";
	
	for (h=0; h<KMap2.Height2; h++)
	{
		if (h % 2 != 0)
		{ 
			var count = 0.85;
		}else{
			var count = 0.8;
		}
		if (h==0)
		{
			Text += "<th style=\"background: gainsboro; width: 15%\" rowspan="+((KMap2.Height2) + 2)  +">";
			for (i=0; i<KMap2.YVariables; i++)
			{
				Text += "<b class=\"header-color\">" + VariableNames2[i+KMap2.XVariables] + "</b>";
			}
		}
		Text += "<th class=\"header-color\" style=\"border-left: 2px solid black;background: gainsboro;width: 15%\" >"+BinaryString(BitOrder2[h],KMap2.YVariables)+"</th>";

		for (w=0; w<KMap2.Width2; w++)
		{

			Text += "<td  ID='"+KMap2[w][h].TDUIName+"' style='text-align:center;'>"
					+ "<input ID="+KMap2[w][h].ButtonUIName +" name="+KMap2[w][h].ButtonUIName +" type='button'  value='"+DisplayValue(KMap2[w][h].Value)+"' onClick=\"ToggleKMEntry(KMap2["+w+"]["+h+"])\" style=\"width: 100%; height: 100%; border: none;\">"
					+ "</td>";
		}
		Text += "</tr>";
	}
	Text +="</td></tr></tbody></table>";
	return Text;
}


function GenerateEquationHTML2()
{
	var j;
	var i;
	for (i=0; i<Equation2.UsedLength; )
	{
		var Text = "<p class=\"header-color remove-bottom\">";
		for (j=0; (j < 8) && (i<Equation2.UsedLength); j++)
		{
			if (i==0) Text+= "<b>"+FunctionText2;
			Text += "<span class=\"blue button half-bottom\" id=\""+Equation2[i].ButtonUIName + "\" onMouseOver=\"SetShowRect(Equation2["+i+"],"+i+");\" onMouseOut=\"SetShowRect(null);\" style=\"padding:5px\">";
			Text += "<b>" + Equation2[i].Expression + "</span>";
			if (i<Equation2.UsedLength-1) Text +=" <span> + </span>";
			i++;
		}	
		Text += "</p>"
	}
	return Text;
}

function ChangeVariableNumber2()
{
	InitializeTables2();
	ClearEquation();
	SetInnerHTML(TTDiv2,GenerateTruthTableHTML2());
	SetInnerHTML(KDiv2,GenerateKarnoMapHTML2());
	SetInnerHTML(EDiv2,GenerateEquationHTML2());
	Search();
	UpdateUI2();
}

function ToggleDontCare()
{
	AllowDontCare2=!AllowDontCare2;
	var i=0;
	for (i=0;i<TruthTable2.length; i++)
	{
		if (TruthTable2[i].KMapEntry.Value==DontCare2)
		{
			TruthTable2[i].KMapEntry.Value=false;
		}
	}
	ChangeVariableNumber2(VariableCount2);
	GetElement("AllowDontCareCB").checked = AllowDontCare2;
}

function PageParameter( Name )
{
	var Regex = new RegExp( "[\\?&]"+Name+"=([^&#]*)" );
	var Results = Regex.exec( window.location.href );
	if( Results != null )
	{
		return Results[1];
	}
	return "";
}

function Init()
{
	SetInnerHTML(KDiv2, GenerateKarnoMapHTML2());
	SetInnerHTML(EDiv2, GenerateEquationHTML2());
	SetInnerHTML(TTDiv2, GenerateTruthTableHTML2());
}