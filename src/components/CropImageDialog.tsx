import { useRef } from "react";
import {ReactCropperElement , Cropper} from "react-cropper"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

import "cropperjs/dist/cropper.css"
interface  CropImageDialogProps{
    src: string;
    cropAspecRatio: number;
    onCropped: (blob:Blob|null) => void;
    onClose: () => void;
}

export default function CropImageDialog({
    src,
    cropAspecRatio,
    onCropped,
    onClose,
}:CropImageDialogProps){
    const cropperRef = useRef<ReactCropperElement>(null);

    function crop(){
        const cropper = cropperRef.current?.cropper;
        if(!cropper) return;

        cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
        onClose();

    }

    return <Dialog open onOpenChange={onClose}>
        <DialogContent>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogHeader>Crop Image</DialogHeader>
            <Cropper src={src} aspectRatio={cropAspecRatio} guides={false} zoomable={false} ref={cropperRef} className="mx-auto size-fit"/>
            <DialogFooter>
                <Button variant="secondary" onClick={onClose}>Abort</Button>
                <Button  onClick={crop}>Crop</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}