// Easy JS ElementRoot Script
// ... to create modal dialogs very easily

export class EJModal {

    dialogElement

    /**
     * Inserts all dependencies of the dialog into DOM
     * Inspired by w3schools: https://www.w3schools.com/howto/howto_css_modals.asp
     */
    constructor(contentElement) {

        const styleElement = this.createDialogStyleElement();
        this.dialogElement = this.createDialogModalElement(contentElement);
        const modalElement = this.dialogElement;

        // shorthand to inject into body
        const body = document.querySelector("body");
        const $ib = (element) => body.insertAdjacentElement("afterbegin", element);

        // do the injection
        $ib(styleElement);
        $ib(modalElement);

        // bind close button's onclick to closeDialog and cancel button
        document.querySelector(".vj-modal-close").addEventListener("click", this.closeDialog.bind(this));

        // register another event listener on the modal itself.
        // close the dialog if the click lands on the backdrop, and not the complete modal itself.
        modalElement.addEventListener("click", (event) => {
            if (event.target === modalElement) {
                this.closeDialog();
            }
        });

        // done

    }

    createDialogStyleElement() {

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = `
        <style type="text/css">
        
        /* The ElementRoot (background) */
        .vj-modal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 10; /* Sit on top */
          left: 0;
          top: 0;
          width: 100%; /* Full width */
          height: 100%; /* Full height */
          background-color: rgb(0,0,0); /* Fallback color */
          background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }
        
        /* ElementRoot Content/Box */
        .gr-outer {
           margin: 1% auto;  /*10% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            min-width: 700px;
            height: 90%;
            /*text-align: center;*/
            border-radius: 10px;
            background-color: #F2F7FC;
            overflow: scroll;
        }        
        
        /* The Close Button */
        .vj-modal-close {
          
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          margin-top: 0.1%;
          margin-left: 88%;
         /* position: sticky;*/
          position: absolute;
          text-align: right;
        }
        
        .vj-modal-close:hover,
        .vj-modal-close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        
        </style>`;

        return tempContainer.firstElementChild;
    }

    createDialogModalElement(contentElement) {

        const modalElement = document.createElement("div");
        modalElement.classList.add("vj-modal");

        //vj-modal-content = gr-outer
        const dialogContent = document.createElement("div");
        dialogContent.classList.add("gr-outer");

        dialogContent.insertAdjacentElement("afterbegin", contentElement);

        dialogContent.insertAdjacentHTML("afterbegin", '<span class="vj-modal-close">&times;</span>');
        modalElement.insertAdjacentElement("beforeend", dialogContent);
        return modalElement;

    }

    /**
     * Opens the dialog
     */
    openDialog() {
        this.findModalElement().style.display = "block";
    }

    /**
     * Closes the dialog (hiding from view)
     */
    closeDialog() {
        this.findModalElement().style.display = null;
    }

    /**
     * From the DOM, find the modal element for operation.
     * Requires that the elements be already injected into the DOM.
     * @returns {HTMLElement}
     */
    findModalElement() {
        return this.dialogElement;
    }

}

