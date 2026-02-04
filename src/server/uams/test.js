// import uams from "./uams.js";

// const mSys = new uams();

// mSys.addOnStart(() => true);
// mSys.addOnStop(() => console.log("stop"));
// var newAction = mSys.createAction(function () {
//   console.log("action");
// });

// newAction();
// const handleDisconnect = function () {
//   console.log("hello");
// };
// setTimeout(handleDisconnect, 2000);
// const handleDisconnect1 = function () {
//   console.log("yair");
// };
// setTimeout(handleDisconnect1, 2000);
// const handleDisconnect2 = function () {
//   console.log("hello");
// };
// setTimeout(handleDisconnect2, 2000);

var a = [1, 2, 3, 4, 5];
for (let b of a) {
  console.log(b);
}
console.log("++++++++++");
for (let c = 0; c < a.length; c++) {
  console.log(a[c]);
}
