/* name   */
console.log("Hello JavaScript");
let name = "横山";
let age = 15;

console.log(name);
console.log(age);

function greet(name) {
  console.log("こんにちは " + name);
}

greet("横山");


console.log(age);

let checkAge = 16;

if (checkAge >= 18) {
  console.log("大人です");
} else {
  console.log("未成年です");
}
const title = document.getElementById("title");
const btn = document.getElementById("btn");

btn.addEventListener("click", function () {
  title.textContent = "押されました！";
});

/*list  */
const fruits = ["りんご", "みかん", "バナナ"];
const list = document.getElementById("list");

fruits.map(function (fruit) {
  const li = document.createElement("li");
  li.textContent = fruit;
  list.appendChild(li);
});