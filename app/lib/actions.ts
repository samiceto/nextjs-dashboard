'use server';
export async function createInvoice(formData: FormData){
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    };
    console.log(rawFormData);
}
export async function submitd(){
    console.log("log,log")
}