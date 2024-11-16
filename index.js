import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
class Customer{
    constructor(name, medi, purchaseDate, price, qty, phNo){
        this.name=name;
        this.medi=medi;
        this.purchaseDate=purchaseDate;
        this.price=price;
        this.qty=qty;
        this.phNo=phNo;
    }
}
class Medicine {
    constructor(name, mfd, exp, price, stock) {
        this.name = name;
        this.mfd = mfd;
        this.exp = exp;
        this.price = price;
        this.stock=stock;
    }
}

function search(arr, key) {
    return arr.findIndex((element) => element.name === key);
}

const username= "Admin";
const password= "Medico@2024";
let logSts= 0;
let meds = [];
let cus = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/login", (req,res)=>{
    res.render("login.ejs", {logSts : logSts});
});

app.get("/logout", (req, res)=>{
    logSts=0;
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("index.ejs", {logSts : logSts});
});

app.get("/store", (req, res) => {
    if (logSts==0) {
        res.redirect("/login");
    } else {
        res.render("store.ejs", { meds: meds , logSts : logSts});
    }
});

app.get("/customer", (req, res) => {
    if (logSts==0) {
        res.redirect("/login");
    } else {
        res.render("customers.ejs", { cus: cus , logSts : logSts});
    }
});

app.get("/outOfStock", (req,res)=>{
    if (logSts==0) {
        res.redirect("/login");
    } else {
        res.render("outOfStock.ejs", { meds: meds , logSts : logSts});
    }
});

app.post("/log", (req, res)=>{
    if(req.body["username"]==username && req.body["password"]==password){
        logSts=1;
        res.redirect("/");
    }else{
        res.render("login.ejs", {logSts : logSts, alertMessage:"Invalid Username Password!"});
    }
});

app.post("/submit", (req, res) => {
    let med = new Medicine(
        req.body["name"],
        req.body["mfd"],
        req.body["exp"],
        req.body["price"],
        req.body["stock"]
    );
    meds.push(med);
    res.redirect("/store");
});

app.post("/deleteMed", (req, res) => {
    const medIndex = req.body.index;
    if (medIndex >= 0 && medIndex < meds.length) {
        meds.splice(medIndex, 1);
    }
    res.redirect("/store");
});

app.post("/deleteCus", (req, res) => {
    const cusIndex = req.body.index;
    if (cusIndex >= 0 && cusIndex < cus.length) {
        cus.splice(cusIndex, 1);
    }
    res.redirect("/customer");
});

app.post("/ok", (req, res) => {
    let customer = new Customer(
        req.body["customerName"],
        req.body["medicineName"],
        new Date(req.body["pDate"]),
        req.body["price"],
        req.body["qty"],
        req.body["PhNo"]
    );
    const i = search(meds, customer.medi);
    if (i !== -1) {
        const med = meds[i];
        if (med.stock >= customer.qty && new Date(med.exp) > customer.purchaseDate) {
            cus.push(customer);
            med.stock -= customer.qty;
        }
    }
    res.redirect("/customer");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
