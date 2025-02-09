//-------------------------------------------------------------------------------------------------------
function AngleCheck(p1, p2, p3) {
  var x = (p3[1] - p1[1]) * (p2[0] - p1[0]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
  if (x > 0)
      return 1;
  else if (x < 0)
      return -1;
  else
      return 0;
}

function dist(p1, p2) {
  return Math.sqrt(Math.pow((p2[1] - p1[1]), 2) + Math.pow((p2[0] - p1[0]), 2));
}
function lineDist(p1, p2, p)
{
  return Math.abs ((p[1] - p1[1]) * (p2[0] - p1[0]) - (p2[1] - p1[1]) * (p[0] - p1[0]));
}

let p0 = [0,0];
let points = false;
let str;
let istr;
let iistr;
function addPoints()
{
  points ^= true;
  if(points)
  {
    document.getElementById("pointerAdd").style.backgroundColor = "#777";
  }
  else{
    document.getElementById("pointerAdd").style.backgroundColor = "#ddd";
  }
}
function compare(p1, p2)
{
  let o = AngleCheck(p0, p1, p2);
  if (o == 0) {
      if (dist(p0, p2) >= dist(p0, p1))
          return -1;
      else
          return 1;
  }
  else {
      if (o == -1)
          return 1;
      else
          return -1;
  }
}

async function calcMin(d)
{
  var min;
  min = 0;
  for (var i = 1; i < d.length; i++) {
      if (d[min][1] > d[i][1])
          min = i;
  }
  return min;
}

function swap(d, min)
{
  let tmp1 = d[0][0], tmp2 = d[0][1];
  d[0][0] = d[min][0];
  d[0][1] = d[min][1];
  d[min][0] = tmp1;
  d[min][1] = tmp2;
  return d;
}

function Brute_Force(d){
  let hull = [];
  str = "BruteForce Algorithm";
  istr = "Time Complexity = O(N^3)";
  iistr = "Space Complexity = O(1)";
  d3.select("#desc").text("Brute force is a straightforward algorithmic approach that involves trying all possible solutions and selecting the best one. In computational geometry, brute force might involve checking all pairs of points or all possible combinations to solve a geometric problem.").style("text-align", "center");
  for(let i = 0; i < d.length; i++)
  {
    for(let j = 0; j < d.length; j++)
    {
      if(i === j) continue;
      let flag = 1;
      for(let k = 0; k < d.length; k++)
      {
        if(j === k || i === k) continue;
        if(AngleCheck(d[i], d[j], d[k]) < 0)
        {
          flag = 0;
          break;
        }
      }
      if(flag)
      {
        hull.push(d[i]);
        hull.push(d[j]);
        break;
      }
    }
  }
  return hull;
}

async function Jarvis_March(d) {
  var min;
  str = "Jarvis March Algorithm";
  d3.select("#desc").text("Jarvis March is a convex hull algorithm that iteratively selects the point with the smallest polar angle with respect to the current point. It continues this process until it forms a convex hull.").style("text-align", "center");
  istr = "Time Complexity = O(NH)";
  iistr = "Space Complexity = O(1)"
  min = await calcMin(d);
  min = [d[min][0], d[min][1]];
  var hull = [];
  while (true) {
      hull.push(min);
      var np = d[0];
      for (var i = 0; i < d.length; i++) {
          var angle = AngleCheck(min, np, d[i]);
          if (np == min || angle == 1 || (angle == 0 && dist(min, d[i]) > dist(min, np)))
              np = d[i];
      }
      min = np;
      if (min[0] == hull[0][0] && min[1] == hull[0][1]) {
          hull.push(min);
          break;
      }
  }
  hull.pop();
  return hull;
}

async function Graham_Scan(d){
  var min = await calcMin(d);
  str = "Graham Scan Algorithm";
  d3.select("#desc").text("Graham Scan is convex hull algorithm that starts by sorting points based on their polar angles with respect to a reference point. It then traverses the sorted points to construct the convex hull.").style("text-align", "center");
  istr = "Time Complexity = O(N log N)";
  iistr = "Space Complexity = O(N)"
  d = swap(d, min);
  p0 = d[0];
  d.sort(compare);
  var hull = [];
  var guideHull = [];
  for(var i = 0; i < d.length; i++)
  {
    while(hull.length >= 2 && AngleCheck(hull[hull.length-2], hull[hull.length-1], d[i]) != 1) {hull.pop(); guideHull.push([hull[hull.length-1], 'pop']);}
    hull.push(d[i]);
    guideHull.push([d[i], 'push']);
  }
  return hull;
}

async function QHSide(d, n, p1, p2, side, hull)
{
  let ind = -1;
  let max_dist = 0;
  for (let i=0; i<n; i++)
  {
      let temp = lineDist(p1, p2, d[i]);
      if ((AngleCheck(p1, p2, d[i]) == side) && (temp > max_dist))
      {
          ind = i;
          max_dist = temp;
      }
  }
  if (ind == -1)
  {
      if(hull[hull.length-1] !== p1) hull.push(p1);
      hull.push(p2);
      return;
  }
  await QHSide(d, n, p1, d[ind], AngleCheck(d[ind], p1, p2), hull);
  await QHSide(d, n, d[ind], p2, -AngleCheck(d[ind], p2, p1), hull);
}
 
async function Quick_Hull(d)
{
  var hull = [];
  str = "Quick Hull Algorithm";
  istr = "Time Complexity = O(N log N)";
  iistr = "Space Complexity = O(N)";
  d3.select("#desc").text("Quick Hull is a divide-and-conquer algorithm for computing the convex hull. It recursively divides the set of points into two subsets, constructs convex hulls for each subset, and then merges them to form the final convex hull.").style("text-align", "center");
    if (d.length < 3)
    {
        return;
    }
    let min_x = 0, max_x = 0;
    for (let i=1; i<d.length; i++)
    {
        if (d[i][0] < d[min_x][0])
            min_x = i;
        if (d[i][0] > d[max_x][0])
            max_x = i;
    }
    await QHSide(d, d.length, d[min_x], d[max_x], 1, hull);
    await QHSide(d, d.length, d[min_x], d[max_x], -1, hull);
    return hull;
}

class Node{
  constructor(value)
  {
    this.x = value[0];
    this.ymin = value[1];
    this.ymax = value[1];
    this.left = null;
    this.right = null;
  }
}

class BinTree{
  constructor()
  {
    this.root = null;
    this.minNode = null;
    this.maxNode = null;
  }
  insert(data)
  {
    var newNode = new Node(data);
    if(!this.root)
    {
      this.root = newNode;
      if(!this.minNode) this.minNode = newNode;
      if(!this.maxNode) this.maxNode = newNode;
    }
    else
      this.insertNode(this.root, newNode);
  }
  insertNode(node, newNode)
  {
    if(newNode.x < node.x)
    {
      if(!node.left)
      {
        node.left = newNode;
        if(this.minNode.x > newNode.x) this.minNode = newNode;
      }
      else
        this.insertNode(node.left, newNode); 
    }
    else if (newNode.x > node.x)
    {
      if(!node.right)
      {
        node.right = newNode;
        if(this.maxNode.x < newNode.x) this.maxNode = newNode;
      }
      else
        this.insertNode(node.right,newNode);
    }
    else
    {
      if(node.ymin > newNode.ymin) node.ymin = newNode.ymin;
      if(node.ymax < newNode.ymax) node.ymax = newNode.ymax;
    }
  }
  async setSingles()
  {
    this.setSinglesRecur(this.root);
  }
  async setSinglesRecur(node)
  {
    if(node)
    {
      if(node.ymin === node.ymax && (node.x !== this.minNode.x && node.x !== this.maxNode.x))
      {
        if(node.ymin < this.minNode.ymin)
        {
          node.ymax = undefined;
        }
        else if(node.ymax > this.maxNode.ymax)
        {
          node.ymin = undefined;
        }
      }
      this.setSinglesRecur(node.left);
      this.setSinglesRecur(node.right);
    }
  }
} 
async function Included(hull, valx, valy)
{
  for(let i = 0; i < hull.length; i++)
  {
    if(hull[i][0] === valx && hull[i][1] === valy)
    {
      return true;
    }
  }
}
async function inorder(node, hull, val)
{
  if(node)
  {
    await inorder(node.left, hull, val);
    if(!await Included(hull, node.x, val? node.ymax : node.ymin) && val? node.ymax : node.ymin !== undefined) hull.push([node.x, val? node.ymax : node.ymin]);
    await inorder(node.right, hull, val);
    // if(!await Included(hull, node.x, val? node.ymax : node.ymin)) hull.push([node.x, val? node.ymax : node.ymin]);
  }
}
async function Grid_Pre_Treatment(d, L, C)
{
  let grid = [];
  
  for(let i = 0; i < w; i+=C)
  {
    grid[i/C] = [];
    for(let j = 0; j < h; j+=L)
    {
      grid[i/C][j/L] = [];
    }
  }
  for(let i = 0; i < d.length; i++)
  {
    grid[Math.floor(d[i][0]/C)][Math.floor(d[i][1]/L)].push(d[i]);
  }
  let BoundaryPoints = [];
  let temp;
  for(let i = 0; i < w/C; i++)
  {
    for(let j = 0; j < h/L; j++)
    {
      if(grid[i][j].length !== 0)
      {
        BoundaryPoints.push(grid[i][j]);
        temp = grid[i][j];
        break;
      }
    }
    for(let j = h/L-1; j >= 0; j--)
    {
      if(grid[i][j].length !== 0)
      {
        if(temp !== grid[i][j])
          BoundaryPoints.push(grid[i][j]);
        break;
      }
    }
  }
  for(let j = 0; j < h/L; j++)
  {
    for(let i = 0; i < w/C; i++)
    {
      if(grid[i][j].length !== 0)
      {
        BoundaryPoints.push(grid[i][j]);
        temp = grid[i][j];
        break;
      }
    }
    for(let i = w/C-1; i >= 0; i--)
    {
      if(grid[i][j].length !== 0)
      {
        if(temp !== grid[i][j])
          BoundaryPoints.push(grid[i][j]);
        break;
      }
    }
  }
  return BoundaryPoints.flat(1);
}
async function Grid_Binary_Tree_Hull(d)
{
  str = "Grid-BinaryTree Hull Algorithm";
  istr = "Time Complexity = O(2n + N)";
  iistr = "Space Complexity = O(N)"
  d3.select("#desc").text("The Grid-Binary-Tree Algorithm presented here is a sophisticated approach that leverages both a grid-preprocessed/pretreated dataset and a binary tree data structure to efficiently compute the convex-concave hull of a set of points in a 2D space.").style("text-align", "center");
  let L = 100, C = 50;
  let treatedPoints = await Grid_Pre_Treatment(d, L, C);
  let tree = new BinTree;
  for(let i = 0; i < treatedPoints.length; i++)
  {
    tree.insert(treatedPoints[i]);
  }
  let hull = [];
  let hull2 = [];
  await tree.setSingles();
  await inorder(tree.root, hull, false);
  await inorder(tree.root, hull2, true);
  return hull.concat(hull2);
}
function CCW_Line_Intersection(d)
{
  d = dataset;
  str = "CCW Line Intersection Algorithm";
  istr = "Time Complexity = O(1)";
  iistr = "Space Complexity = O(1)";
  if(d.length === 4)
  {
    let val = ((AngleCheck(d[0], d[1], d[2]) * AngleCheck(d[0], d[1], d[3])) <= 0) && ((AngleCheck(d[2], d[3], d[0]) * AngleCheck(d[2], d[3], d[1])) <= 0);
    d3.select("#desc")
    .text(val? "Intersecting Line Segments! This algorithm checks if two line segments intersect by using the Counter-Clockwise (CCW) orientation test. It determines whether three points are listed in a counter-clockwise order." : "Non-Intersecting Line Segments! This algorithm checks if two line segments intersect by using the Counter-Clockwise (CCW) orientation test. It determines whether three points are listed in a counter-clockwise order.")
    .style("text-align", "center");
  }
  else return [];
  return d;
}
function Slope_Line_Intersection(d)
{
  str = "Slope Line Intersection Algorithm";
  istr = "Time Complexity = O(1)";
  iistr = "Space Complexity = O(1)";
  d3.select("#desc").text("").style("text-align", "center");
  let slp1 = (d[1][1]-d[0][1])/(d[1][0]-d[0][0]);
  let slp2 = (d[3][1]-d[2][1])/(d[3][0]-d[2][0]);
  let itcp1 = d[0][1] - slp1 * d[0][0];
  let itcp2 = d[2][1] - slp2 * d[2][0];

  let xcof = [-slp1, -slp2];
  let ycof = [1, 1];
  let intcp = [itcp1, itcp2];

  let eliminator = [];
  eliminator[0] = [];
  eliminator[1] = [];

  eliminator[0][0] = ycof[1] * xcof[0];
  eliminator[0][1] = ycof[1] * intcp[0];
  eliminator[1][0] = ycof[0] * xcof[1];
  eliminator[1][1] = ycof[0] * intcp[1];

  let xval = (eliminator[0][1] - eliminator[1][1]) / (eliminator[0][0] - eliminator[1][0]);
  let yval = (intcp[0] - xcof[0]*xval) / ycof[0];
  console.log(xval, yval);
  let minx = 10000, miny = 10000, maxx = -10000, maxy = -10000;
  for(let i = 0; i < d.length; i++)
  {
    if(minx > d[i][0]) minx = d[i][0];
    if(miny > d[i][1]) miny = d[i][1];
    if(maxx < d[i][0]) maxx = d[i][0];
    if(maxy < d[i][1]) maxy = d[i][1];
  }
  let _d = [];
  for(let i = 0; i < d.length; i++)
    _d.push(d[i]);
  if(xval <= maxx && xval >= minx && yval <= maxy && yval >= miny)
  {
    d3.select("#desc")
    .text(`Intersecting at Point (${xval}, ${yval})! This algorithm involves comparing the slopes of two lines to determine whether they are parallel, identical (overlapping), or will intersect at a point.`)
    .style('text-align', 'center');
    _d.push([xval, yval]);
  }
  else{
    d3.select("#desc")
    .text(`No Intersecting Point! This algorithm involves comparing the slopes of two lines to determine whether they are parallel, identical (overlapping), or will intersect at a point.`)
    .style('text-align', 'center');
  }
  return _d;
}
function Translation_Manhattan_Intersection(d)
{
  str = "Translation-Manhattan Intersection Algorithm";
  istr = "Time Complexity = O(1)";
  iistr = "Space Complexity = O(1)";
  let dat = "The Translation-Manhattan Intersection Algorithm is a method designed to determine the intersection point of two lines on a 2D plane. This algorithm used the principles of translation to set one of the points as the origin and the Manhattan distance formula to efficiently compute the point of intersection between two given lines.";
  if(d.length === 4)
  {
    let AB, dAB, Cos, Sin, X, ABpos;
    if(d[0][0] === d[1][0] && d[0][1] === d[1][1] || d[2][0] === d[3][0] && d[2][1] === d[3][1])
    {  d3.select("#desc")
      .text(`No Intersecting Point! ${dat}`)
      .style('text-align', 'center');
      return [];
    }
    if(d[0][0] === d[2][0] && d[0][1] === d[2][1] || d[1][0] === d[2][0] && d[1][1] === d[2][1] || d[0][0] === d[3][0] && d[0][1] === d[3][1] || d[1][0] === d[3][0] && d[1][1] === d[3][1])
    {
      d3.select("#desc")
      .text(`No Intersecting Point! ${dat}`)
      .style('text-align', 'center');
      return [];
    }
    let _d = [];
    for(let i = 0; i <d.length ; i++)
    {
      _d.push([d[i][0], d[i][1]]);
    }
    _d[1][0] -= _d[0][0];
    _d[1][1] -= _d[0][1];
    _d[2][0] -= _d[0][0];
    _d[2][1] -= _d[0][1];
    _d[3][0] -= _d[0][0];
    _d[3][1] -= _d[0][1];

    dAB = Math.sqrt(_d[1][0]*_d[1][0] + _d[1][1]*_d[1][1]);

    Cos = _d[1][0]/dAB;
    Sin = _d[1][1]/dAB;
    X = _d[2][0]*Cos + _d[2][1]*Sin;
    _d[2][1] = _d[2][1]*Cos - _d[2][0]*Sin;
    _d[2][0] = X;
    X = _d[3][0]*Cos + _d[3][1]*Sin;
    _d[3][1] = _d[3][1]*Cos - _d[3][0]*Sin;
    _d[3][0] = X;

    if(_d[2][1] < 0 && _d[3][1] < 0 || _d[2][1] >= 0 && _d[3][1] >= 0)
    {
      d3.select("#desc")
      .text(`No Intersecting Point! ${dat}`)
      .style('text-align', 'center');
      return [];
    }
    ABpos = _d[3][0] + (_d[2][0] - _d[3][0])*_d[3][1]/(_d[3][1]-_d[2][1]);

    if(ABpos < 0 || ABpos > dAB) return [];

    let val = [_d[0][0] + ABpos*Cos, _d[0][1] + ABpos*Sin];
    _d = [];
    for(let i = 0; i <d.length ; i++)
    {
      _d.push([d[i][0], d[i][1]]);
    }
    _d.push(val);
    d3.select("#desc")
    .text(`Intersecting at Point (${val[0]}, ${val[1]})! ${dat}`)
    .style('text-align', 'center');
    return _d;
  }
  else 
  {
    d3.select("#desc")
    .text(`Only Two Lines! ${dat}`)
    .style('text-align', 'center');
    return [];
  }
}

async function Sweep_Line_Intersection(d)
{
  str = "Sweep Line Algorithm";
  istr = "O()";
  if(!(d.length % 2))
  {
    let events = [];
    for(let i = 0; i< d.length; i+=2)
    {
      events.push([d[i], true, i]);
      events.push([d[i+1], false, i]);
    }
    events.sort((a,b) => a[0][0] - b[0][0]);
    let S = [];
    let ans = 0;


    // let S =[];
    // let ans = 0;
    // for(let i = 0; i < d.length; i++)
    // {
    //   let c = events[i];
    //   let index = c[2];
    //   if(c[1])
    //   {
        

    //     let flag = false;
    //     if(){}
    //     if(){}
    //     if(){}

    //     if(!await Included(c, c[0][0], c[0][1])) S.push(c);
    //   }
    //   else
    //   {

    //   }
    // }
  }
}
// async function Bentley_Ottoman(d)
// {
//   str = "Bentley Ottoman Algorithm";
//   istr = "O()";
//   if(!(d.length % 2))
//   {
//     let events = [];
//     for(let i = 0; i < d.length; i+=2)
//     {
//       if(d[i][0] === d[i+1][0])
//         events.push([d[i],d[i+1],2]);
//       else
//       {
//         events.push([d[i],d[i+1],0]);
//         events.push([d[i],d[i+1],1]);
//       }
//     }
//     events.sort((a,b) => a[0][0] - b[0][0]);
//     let S = [];
//     for(let i = 0; i < events.length; i++)
//     {
//       if(events[i][2] === 0)
//         if(!await Included(S, events[i][0][0], events[i][0][1])) S.push(events[i][0]);
//       else if(events[i][2] === 1) {}
//       else {}
//     }
//   }
// }
//-------------------------------------------------------------------------------------------------------

var w = 1200;
var h = 600;

var dataset = [];
var d1 = [
  [500,550],
  [650,500],
  [600,400],
  [600,350],
  [750,400],
  [500,400],
  [850,300],
  [500,250],
  [600,200],
  [750,200],
  [650,150],
  [500,100],
  [150,250],
  [250,200],
  [350,250],
  [350,50],
  [150,450],
  [250,500],
  [350,450],
  [250,350],
  [50, 400]
];
d2 = [
  [519, 445], 
  [519, 169],
  [189, 343],
  [199, 319],
  [199, 343],
  [249, 313],
  [329, 319],
  [399, 355],
  [469, 337],
  [469, 301],
  [329, 277],
  [469, 259],
  [399, 229],
  [329, 211],
  [519, 337],
  [799, 253],
  [749, 235],
  [779, 403],
  [109, 301],
  [129, 277],
  [149, 253],
  [149, 373],
  [199, 211],
  [199, 403],
  [299, 145],
  [299, 439],
  [249, 169],
  [249, 427],
  [499, 91],
  [499, 547],
  [329, 133],
  [329, 445],
  [399, 97],
  [399, 457],
  [469, 85],
  [469, 493],
  [409, 85],
  [489, 127],
  [489, 457],
  [699, 283],
  [699, 355],
  [599, 211],
  [599, 391],
  [779, 205],
  [779, 487],
  [749, 235],
  [749, 373],
  [799, 169],
  [799, 475],
  [829, 193],
  [879, 145],
  [849, 433],
];
var x;//-------------------------------------
let i = 0;

async function reset(check, research)
{
  RemoveElement(3);
  if(check)
  {
    dataset = [];
    if(research)
    {
      for(let j = 0; j < d2.length; j++)
      {
        dataset.push(d2[j]);
      }
    }
    else
    {
      for(let i = 0; i < document.getElementById("quantity").value ; i++)
      {
        dataset.push([(Math.floor(Math.random()*100000)%w), (Math.floor(Math.random()*10000%Math.random()*1000)%h)])
      }
    }
  }
  await createCircles();
}
function RemoveElement(val)
{
  if(val & 1)
  {
    svg.selectAll("#hullpath").remove();
    svg.selectAll("#HullCircle").remove();
  }
  if(val & 2)
  {
    svg.selectAll("circle").remove();
  }
  if(val & 4)
  {
    dataset = [];
  }
  i = 0;
}

var svg = d3.select("#outputscreen")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("viewBox", [0, 0, w, h])
  .attr("style", "max-width: 100%; height: auto;")
  .style("background", "#eee")
  .on('click', (event) => {
    if(points)
    {
      dataset.push([Math.floor(d3.pointer(event)[0]), Math.floor(h - d3.pointer(event)[1])]);
      reset(false);
    }});

  var Tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0)
  .style("background-color", "none")
  .style("border-radius", "10px")
  .style("color", "black")
  .style("text-align","center")
  .style("position","absolute")
  .style("min-width","20px")
  .style("height","auto")
  .style("border","yellow")
  .style("background","cyan")
  .style("padding","14px")
  .style("left", 0)
  .style("top", 0)

function ShowGrid()
{
  let checkBox = document.getElementById("grid");
  if(checkBox.checked === true)
  {
    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let width = svg.attr("width") - margin.left - margin.right;
    let height = svg.attr("height") - margin.top - margin.bottom;
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + 0 + ")");
    let x = d3.scaleLinear().rangeRound([0-margin.left, width+margin.right]);//.padding(0.4);
    let y = d3.scaleLinear().rangeRound([height+margin.bottom+margin.top, 0]);
    x.domain([0, w]);
    y.domain([0, h]);
    g.append("g")
    .attr("class", "xAxis")
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0," + height + ")");

    g.append("g")
    .attr("class", "yAxis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "end");

    d3.selectAll("g.yAxis g.tick")
    .append("line")
    .attr("class", "gridline")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("stroke", "#9ca5aecf") // line color
    .attr("stroke-dasharray","4") // make it dashed;;

    d3.selectAll("g.xAxis g.tick")
    .append("line")
    .attr("class", "gridline")
    .attr("x1", 0)
    .attr("y1", -height)
    .attr("x2", 0)
    .attr("y2", 0)
    .attr("stroke", "#9ca5aecf") // line color
    .attr("stroke-dasharray","4") // make it dashed;
  }
  else
  {
    svg.selectAll("g").remove();
  }
}
  var mouseover = function(d) {
    Tooltip.style("opacity", 1)
    // d3.select(this)
    // .style("stroke", "black")  
    // .style("opacity", 1)
  }
  var mousemove = function(event, d) {
    Tooltip.html(`(${Math.trunc(d3.select(this).attr("cx"))},${Math.trunc(h-d3.select(this).attr("cy"))})`)
    .style("left", (d3.pointer(event)[0]+270) + "px")
    .style("top", (d3.pointer(event)[1]-5) + "px")
  }
  var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    .html('')
    .style("left", 0)
    .style("top", 0)
    // d3.select(this)
    // .style("stroke", "none")
    // .style("opacity", 0.8)
  }
async function createCircles()
{
  svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("id", "customCircle")
  .attr("cx", function(d) {
    return d[0];
  })
  .attr("cy", function(d) {
    return h-d[1];
  })
  .attr("r", function(d) {
    return 5; 
    // Math.sqrt(h - d[1]);
  })
  .attr("fill", "#000000")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);
}

function JMGSPathAlgo(x)
{
  let s = "M"+ x[0][0] + " " + (h-x[0][1] + " ");
  for(let i = 1; i < x.length ; i++)
  {
    s += "L" + x[i][0] + " " + (h-x[i][1] + " ");
  }
  s += "Z";
  return s;
}

function BFPathAlgo(x)
{
  let s = "";
  for(let i = 0; i < x.length ; i+=2)
  {
    s += "M"+ x[i][0] + " " + (h-x[i][1] + " ");
    s += "L" + x[i+1][0] + " " + (h-x[i+1][1] + " ");
  }
  s += "Z";
  return s;
}

function QHPathAlgo(x)
{
  let s = "M"+ x[0][0] + " " + (h-x[0][1] + " ");
  for(let i = 1; i < x.length ; i++)
  {
    if(x[i][0] === x[0][0] && x[i][1] === x[0][1])
    {
      s += "M"+ x[0][0] + " " + (h-x[0][1] + " ");
    }
    else s += "L" + x[i][0] + " " + (h-x[i][1] + " ");
  }
  return s;
}

function CCW_Line_PathAlgo(d)
{
  if(d.length === 4)
    return `M${d[0][0]} ${h-d[0][1]} L${d[1][0]} ${h-d[1][1]} M${d[2][0]} ${h-d[2][1]} L${d[3][0]} ${h-d[3][1]}`;
  else
    return;
}

function SlopePathAlgo(d)
{
  if(d.length === 5)
    return `M${d[0][0]} ${h-d[0][1]} L${d[1][0]} ${h-d[1][1]} M${d[2][0]} ${h-d[2][1]} L${d[3][0]} ${h-d[3][1]} M${d[4][0]} ${h-d[4][1]}`;
  else
  return `M${d[0][0]} ${h-d[0][1]} L${d[1][0]} ${h-d[1][1]} M${d[2][0]} ${h-d[2][1]} L${d[3][0]} ${h-d[3][1]}`;
}

async function CreateHullPaths(Algorithm, PathAlgo)
{
  let t1 = performance.now();
  x = await Algorithm(dataset);
  let t2 = performance.now();
  console.log(x);
  var path = svg.append("path")
  .attr("id", "hullpath")
  .attr("stroke", "black")
  .attr("stroke-width", "2")
  .attr("stroke-linecap", "round")
  .attr("fill", "none")
  .attr("d", PathAlgo(x))

  var length = path.node().getTotalLength();
  path.attr("stroke-dasharray", length + " " + length)
  .attr("stroke-dashoffset", length)
  .transition()
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .duration(1000)
  
    svg.selectAll('#HullCircle')
    .data(x)
    .enter()
    .append("circle")
    .attr("id", "HullCircle")
    .attr("cx", function(d) {
      return d[0];
    })
    .attr("cy", function(d) {
      return h-d[1];
    })
    .attr("r", function(d) {
      return 5; 
      // Math.sqrt(h - d[1]);
    })
    .attr("fill", "#ff00ff")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

    d3.select("#infotitle")
    .select("h2")
    .text(`${str}`)
    .style("text-align", "center");

    d3.select("#TComplexity")
    .text(istr)
    .style("text-align", "center");

    d3.select("#SComplexity")
    .text(iistr)
    .style("text-align", "center");

    d3.select("#timespent")
    .text(`Time Elapsed: ${t2-t1}ms`)
    .style("text-align", "center");
}


//---------

function JMGuide()
{
  if(i == 0)
  {
    svg.append('circle')
    .attr("id", "GuideCircle")
    .attr("r",10)
    .attr("cx", x[0][0])
    .attr("cy", h-x[0][1])
    .attr("fill", "transparent")
    .style("stroke", "black")
    .style("stroke-width", "2px");
  }
  else
  {
    svg.selectAll("#GuideCircle").remove();
  }
  // let temp;
  // if(i < x.length-1)
  //   temp = x.filter((e, j) => i <= j+1 && i >= j-1);
  // else if (i === x.length-1)
  //   temp = [x[x.length-2],x[x.length-1],x[0]];
  // if(temp !== undefined)
  // {
  //   console.log(i,temp);
  //   let guidepath = svg.append('path')
  //   .attr("stroke", "black")
  //   .attr("stroke-width", "2")
  //   .attr("stroke-linecap", "round")
  //   .attr("fill", "none")
  //   .attr("id", `gp${i}`)
  //   .attr("d", `M${temp[0][0]} ${h-temp[0][1]} L${temp[1][0]} ${h-temp[1][1]} L${temp[2][0]} ${h-temp[2][1]}`);

  //   var length = guidepath.node().getTotalLength();
  //   guidepath.attr("stroke-dasharray", length + " " + length)
  //   .attr("stroke-dashoffset", length)
  //   .transition()
  //   .ease(d3.easeLinear)
  //   .attr("stroke-dashoffset", 0)
  //   .duration(1000)

  //   var val = i-1;
  //   setTimeout(() => {
  //     svg.select(`#gp${val}`)
  //     .remove()
  //   }, 3000);
    i++;
    i%=dataset.length;
  // }
}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "1172px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "1422px";
}