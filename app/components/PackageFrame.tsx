'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

export default function PackageFrame(){
    const [productURL, setProductURL] = useState<string>("")
    const buttonRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)



    const doWork = async () => {
        if(!buttonRef.current || !inputRef.current)
            return;

        if(inputRef.current.value === ""){
            inputRef.current.focus();
            return;
        }

        buttonRef.current.disabled = true;


        var productId;

        if(productURL.includes("products_id="))
            productId = productURL.split("products_id=")[1];
        else
            productId = productURL;

        
        
        const data = await fetch(`/api/fetchInfo?product=${productId}`);

        if(data.status === 200){
            const blob = await data.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productId}.chkn`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            buttonRef.current.disabled = false;
            return;
        }

        buttonRef.current.disabled = false;
        alert("Product not found")
    }



    return(
        <div className="border w-full rounded-lg p-4 flex flex-col">
            <Label className="pb-1" htmlFor="productURL">Package URL</Label>
            <Input ref={inputRef} value={productURL} onChange={(e) => setProductURL(e.target.value)} className="hover:bg-zinc-900 focus:bg-zinc-900 focus-visible:ring-0" id="productURL" placeholder="https://www.imvu.com/shop/product.php?products_id=xxxxxxxxx" />
            <Button ref={buttonRef} onClick={() => doWork()} className="ml-auto h-8 w-24 mt-3 bg-zinc-950 hover:bg-zinc-900 border text-white">Extract</Button>
        </div>
    )
}