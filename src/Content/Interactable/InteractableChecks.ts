import { AnchorLocation } from "../Common/Geometry";
import { Interactable } from "./Interactable";

export type InactiveReason = "active" | "offscreen" | "disabled" | "small" | "behind";

export const onScreenCheck = (interactable: Interactable) => {
    if(interactable.bounds.getOnscreenPercentage() >= 0.75){
        return true;
    }else{
        interactable.inactiveReason = "offscreen";
        return false;
    }
}

export const disabledCheck = (interactable: Interactable) => {
    let formElements = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];
    if(!formElements.includes(interactable.element.nodeName) || !interactable.element.hasAttribute('disabled')){
        return true;
    }else{
        interactable.inactiveReason = "disabled";
        return false;
    }
}

export const sizeCheck = (interactable: Interactable) => {
    if(interactable.bounds.getSquareSize() > 100){
        return true;
    }else{
        interactable.inactiveReason = "small";
        return false;
    }
}

export const layerIndexCheck = (interactable: Interactable) => {
    let rawElementLayers = document.elementsFromPoint(interactable.bounds.getAnchor(AnchorLocation.Middle).x, interactable.bounds.getAnchor(AnchorLocation.Middle).y);
    let elementLayers = [];
    for(let element of rawElementLayers){
        if(element === interactable.element){
            break;
        }
        if(element.classList.contains('gamepad-navigator-overlay-canvas')){
            continue;
        }

        if(!isTransparent(element as HTMLElement) &&
        !isAncestor(interactable.element, element as HTMLElement) &&
        !isAncestor(element as HTMLElement, interactable.element)){
            console.log(interactable.element, "is behind", element)
            interactable.inactiveReason = "behind";
            return false;
        }
        elementLayers.push(element);
    }
    return true;
}

function isAncestor(element: HTMLElement, ancestor: HTMLElement){
    let parent = element.parentElement;
    while(parent){
        if(parent === ancestor){
            return true;
        }
        parent = parent.parentElement;
    }
    return false;
}

function isTransparent(element: HTMLElement){
    let bgColor = getInheritedBackgroundColor(element)
    if(window.getComputedStyle(element).filter.includes('blur') ||
    window.getComputedStyle(element).backdropFilter.includes('blur') ||
    window.getComputedStyle(element).clip !== "auto"){
        console.log("blur", window.getComputedStyle(element).clip !== "auto")
        return false;
    }else{
        if(!bgColor.startsWith('rgba')){
            console.log(bgColor)
            return false;
        }else{
            let alpha = bgColor.split(",")[3].trim();
            let alphaNum = parseInt(alpha.substring(0, alpha.length - 1));
            if(alphaNum > 127){
                console.log("alpha", alphaNum)
                return false;
            }else{
                return true;
            }
        }
    }
}

function getInheritedBackgroundColor(el: HTMLElement) {
    // get default style for current browser
    var defaultStyle = getDefaultBackground() // typically "rgba(0, 0, 0, 0)"
    
    // get computed color for el
    var backgroundColor = window.getComputedStyle(el).backgroundColor
    
    // if we got a real value, return it
    if (backgroundColor != defaultStyle) return backgroundColor
  
    // if we've reached the top parent el without getting an explicit color, return default
    if (!el.parentElement) return defaultStyle
    
    // otherwise, recurse and try again on parent element
    return "rgba(0,0,0,0)"
  }
  
  function getDefaultBackground() {
    // have to add to the document in order to use getComputedStyle
    var div = document.createElement("div")
    document.head.appendChild(div)
    var bg = window.getComputedStyle(div).backgroundColor
    document.head.removeChild(div)
    return bg
  }