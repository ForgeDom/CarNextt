"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vjwhvtoaimxkpubedbao.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqd2h2dG9haW14a3B1YmVkYmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzg1MjYsImV4cCI6MjA2MDkxNDUyNn0.FVfec86PZ7wwyPr7gdYfOC40J7AQp71DCQPKRSNMnt8";
const client = createClient(supabaseUrl, supabaseKey);

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

      const bg = document.querySelector('.background-image-container') as HTMLElement;
    if (bg) {
      bg.style.display = 'none';
    }
    

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    // Check if user already exists
    let { data: existingUsers, error: fetchError } = await client
      .from("users")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      console.error(fetchError);
      alert("Помилка при з'єднанні з базою.");
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      alert("Користувач з такою поштою вже існує.");
      return;
    }

    // Insert new user
    const { error: insertError } = await client
      .from("users")
      .insert([{ email, password, cart: [] }]); // Initialize cart as empty array

    if (insertError) {
      console.error(insertError);
      alert("Не вдалося створити користувача.");
      return;
    }

    alert("Акаунт створено успішно!");
     router.push("/");
  }

  return (
    <>
      <div className="background-image-container" style={{ backgroundImage: "none", backgroundColor: "#fff" }}></div>
      <div className="wrapper" style={{ backgroundImage: "none", backgroundColor: "#fff" }}>
        <section>
          <div className="subscribe-section">
            <p>Щоб створити акаунт, заповніть поля:</p>
            <form className="subscribe-form" onSubmit={handleSignUp}>
              <input
                type="email"
                placeholder="Ваша електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Зареєструватися</button>
            </form>

            <p onClick={() => router.push("/")} className="already-account-txt">
              Вже маєте акаунт? Увійдіть!
            </p>
          </div>
        </section>
      </div>
    </> 
  );
}
