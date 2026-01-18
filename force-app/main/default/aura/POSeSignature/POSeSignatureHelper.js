({
    startDrawing: function(cmp, x, y) {
        cmp.set("v.isDrawing", true);
        let canvas = cmp.find("signatureCanvas").getElement();
        let ctx = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();

        // Adjust for canvas position on page
        let drawX = x - rect.left;
        let drawY = y - rect.top;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.moveTo(drawX, drawY);
    },

    draw: function(cmp, x, y) {
        if (!cmp.get("v.isDrawing")) return;
        
        let canvas = cmp.find("signatureCanvas").getElement();
        let ctx = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();

        // Adjust for canvas position on page
        let drawX = x - rect.left;
        let drawY = y - rect.top;

        ctx.lineTo(drawX, drawY);
        ctx.stroke();
    },

    stopDrawing: function(cmp) {
        if(cmp.get("v.isDrawing")) {
            cmp.set("v.isDrawing", false);
            this.save(cmp);
        }
    },
    
    save: function(cmp) {
        let canvas = cmp.find("signatureCanvas").getElement();
        let dataURL = canvas.toDataURL("image/png");
        cmp.set("v.signatureData", dataURL);
        cmp.set("v.isAccepted", true);
    }
})