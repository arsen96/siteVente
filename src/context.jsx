import React, { Component } from 'react'
import {storeProducts, detailProduct} from './data';
//import Product from './components/Product';

const ProductContext = React.createContext()
//Provider
//Consumer


class ProductProvider extends Component {
state = {
    products:[],
    detailProduct:detailProduct,
    cart:[],
    modalOpen: false,
    modalProduct:detailProduct,
    cartSubTotal:0,
    cartTax:0,
    cartTotal:0
};



componentDidMount(){
    this.setProducts();
}

setProducts = () =>{
    let tempProducts = [];
    storeProducts.forEach(item => {
        const singleItem = {...item};
        tempProducts = [...tempProducts,singleItem];
        this.setState(() => {
            return {products:tempProducts}
        })
    })
}

getItem = (id) => {
    const product = this.state.products.find(item =>{
       return item.id === id
    })
    return product;
}

handleDetail = (id) => {
   const product = this.getItem(id);
   this.setState(() => {
       return {detailProduct:product}
   })
}

addToCart = (id) => {
    let tempProducts = [...this.state.products];
    //Obtenir l'index du produit ajouté
    const index = tempProducts.indexOf(this.getItem(id));
    //Obtenir l'ensemble des valeurs de mon produit ajouté
    //Modifier les valeurs de mon produit ajouté
    tempProducts[index].inCart = true;
    tempProducts[index].count = 1;
    tempProducts[index].total = tempProducts[index].price;
    //Ajouter a mon state cart les objets
    this.setState(() =>{
        return {products:tempProducts, cart:[...this.state.cart,tempProducts[index]]}
    }, () => {
        this.addTotals();
    }
    )
}

openModal = id =>{
    const product = this.getItem(id);
    this.setState(() => {
        return {modalProduct:product,modalOpen:true}
    })
}

closeModal = () => {
this.setState(() => {
    return {modalOpen:false}
})
}

increment = (id) => {
    let tempCart = [...this.state.cart]
    //If item id is exactly the same with one which i clicked
    const selectedProduct = tempCart.find(item =>item.id === id)
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;


    this.setState(() => {
        return {cart:[...tempCart]}
    }, () => {
        this.addTotals();
    })

    
   
}

decrement = (id) => {
    const tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id)
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count -1
    if(product.count == 0){
        this.removeItem(id)
    }else{
        product.total = product.count * product.price
        this.setState(() => {
            return {cart:[...tempCart]}
        },this.addTotals())
    }

}

removeItem = (id) =>{
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter(item => (item.id !== id))

    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(() => {
       return {
           cart:[...tempCart],
           products:[...tempProducts]
       }
    },() => {
        this.addTotals()
    })

}

clearCart = (id) =>{
    this.setState(() => {
        return {cart:[]}
    },() => {
        this.setProducts()
    })
}

addTotals = () =>{
let subTotal = 0;
this.state.cart.map(item => (subTotal += item.total));
const tax = 20
const taxPourcentage = ((tax / 100)+1);
const convertTaxResult = parseFloat(subTotal * taxPourcentage ).toFixed(2);
this.setState(() =>{
    return {
        cartSubTotal:subTotal,
        cartTax:tax,
        cartTotal:convertTaxResult
    }
})
}




    render () {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail:this.handleDetail,
                addToCart:this.addToCart,
                openModal:this.openModal,
                closeModal:this.closeModal,
                increment: this.increment,
                decrement:this.decrement,
                removeItem:this.removeItem,
                clearCart: this.clearCart
            }}>
                
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}




const ProductConsumer = ProductContext.Consumer
export {ProductProvider, ProductConsumer}