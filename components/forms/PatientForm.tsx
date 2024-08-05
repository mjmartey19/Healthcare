"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";


export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}


const PatientForm = () => {

  const router = useRouter()

    const [isLoading, setIsLoading] = useState(false);
  // Define form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver( UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Define a submit handler.
  async function onSubmit({name, email, phone}: z.infer<typeof  UserFormValidation>) {
    setIsLoading(true);

    try{
      //Create userData object
      const userData = { name, email, phone }
      console.log(userData)
      //Store user in Auth database (AppWrite)
      const user = await createUser(userData);
      console.log(user)
      if(user) router.push(`/patients/${user.$id}/register `) //Reidrect user to register page after ifno stored in database

    }catch(error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-4 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Martey Jamel"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="schorlar2468@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(551)-120-1245"
        
        />

        <SubmitButton isLoading={isLoading}>Get Started </SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
