'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const FormSchema=z.object({
    id:z.string(),
    customerId:z.string(),
    amount:z.coerce.number(),
    status:z.enum(['pending', 'paid']),
    date:z.string(),
})
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   try{ await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;}catch(ERROR){
        return{
            message: 'the invoice could not be updated'
        }
    }
   
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
const CreateInvoice=FormSchema.omit({id:true, date:true});
export async function createInvoice(formData: FormData){
    const {customerId,amount,status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
   const amountInCents= amount * 100;
   const date = new Date().toISOString().split('T')[0];
   try{await sql`
   INSERT INTO invoices (customer_id, amount, status, date)
   VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
 `;}
 catch(error){
    return{
        message:'invoice could not be created'
    }

 }
   

 
 revalidatePath('/dashboard/invoices');
 redirect('/dashboard/invoices');
}
export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');
    try{await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return{
        message:'invoice deleted'
    }}
    catch(error){
        return{
            message:'the invoice could not be deleted'
        }
    }
    
  }