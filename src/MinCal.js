//Here is the Simple Mini Calculator Logic without Any Css

import React, {useState} from "react"

const MinCal = ()=> {
    const [result, setResult] = useState({
        firstHalf: "",
        secondHalf: ""
    })
    const [ display, setDisplay] = useState(0)
    const [ mode, setMode ] = useState("")
    const handleChangeSign = (key)=>{
        if(!result.firstHalf) {
            alert("Select One Value AtLeast")
            return
        }
        if(result.secondHalf){
            alert("Calculate These Value First")
            return;
        }
        setDisplay(0)
        setMode(key)
    }

    const handleNumeric = (value) =>{
        if(!mode){
            setResult( { ...result, firstHalf: result.firstHalf + value})
        }else {
            setResult( { ...result, secondHalf: result.secondHalf + value})
        }
    }
    const onSubmitChange = (e) => {
        e.preventDefault()
        const firstHalf = result.firstHalf;
        const secondHalf = result.secondHalf
        setResult({ firstHalf: "", secondHalf: ""})
        setMode("")
        switch (mode){
            case '+': return setDisplay(parseInt(firstHalf) + parseInt(secondHalf))
            case '-': return setDisplay(parseInt(firstHalf) - parseInt(secondHalf))
            case '/': return setDisplay(parseInt(firstHalf) / parseInt(secondHalf))
            case '*': return setDisplay(parseInt(firstHalf) * parseInt(secondHalf))
        }

    }
    return(
        <div>
            <input type="text" value={`${result.firstHalf}${mode}${result.secondHalf}`} />
            Display: {display}
            <div>
                <button onClick={()=>handleNumeric("1")}>1</button>
                <button onClick={()=>handleNumeric("2")}>2</button>
                <button onClick={()=>handleNumeric("3")}>3</button>
                <button onClick={()=>handleNumeric("4")}>4</button>
                <button onClick={() => handleChangeSign("+")}>+</button>
            </div>
            <div>
                <button onClick={()=>handleNumeric("5")}>5</button>
                <button onClick={()=>handleNumeric("6")}>6</button>
                <button onClick={()=>handleNumeric("7")}>7</button>
                <button onClick={()=>handleNumeric("8")}>8</button>
                <button onClick={() => handleChangeSign("-")}>-</button>
            </div>
            <div>
                <button onClick={()=>handleNumeric("9")}>9</button>
                <button onClick={()=>handleNumeric("0")}>0</button>
                <button onClick={() => handleChangeSign("/")}>/</button>
                <button onClick={() => handleChangeSign("*")}>*</button>
                <button onClick={onSubmitChange}>=</button>
            </div>
        </div>
    )
}

export default MinCal