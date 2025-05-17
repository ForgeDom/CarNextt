"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vjwhvtoaimxkpubedbao.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqd2h2dG9haW14a3B1YmVkYmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzg1MjYsImV4cCI6MjA2MDkxNDUyNn0.FVfec86PZ7wwyPr7gdYfOC40J7AQp71DCQPKRSNMnt8";
const client = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  let { data: users, error } = await client
    .from("users")
    .select("*");

  if (error) {
    console.log(error);
    alert("Помилка при з'єднанні з базою.");
    return;
  }

  const foundUser = users?.find(
    (user) => user.email === email && user.password === password
  );

  if (foundUser) {
    localStorage.setItem("email", email);

    const cart = foundUser.cart ?? []; // if cart is null, fallback to empty array
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart:", localStorage.getItem("cart"));

    console.log(localStorage.getItem('email'));
    router.push("/pages/oldTimer");
  } else {
    alert("Неправильний логін або пароль.");
  }
}



  return (
    <div className="wrapper">
      <section>
        <div className="subscribe-section">
          <p>Щоб увійти заповніть поля:</p>
          <form className="subscribe-form" onSubmit={(e) => { handleSubmit(e) }}>
            <input
              type="email"
              id="email"
              placeholder="Ваша електронна пошта"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              required
            />

            <input
              type="password"
              id="password"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              required
            />

            <button type="submit">Увійти</button>            
          </form>
          <p
              className="already-account-txt"
              onClick={() => router.push("/pages/oldTimer/sign")}
              style={{ cursor: "pointer" }}
            >
              Вперше на нашому сайті? Зареєструйтесь для входу!
            </p>
        </div>
      </section>
    </div>
  );
}
