"use client"
import { Container } from 'styled-system/jsx'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'
import { css } from "styled-system/css";
import { signIn } from 'next-auth/react';

export default function Home() {
  const router = useRouter()
  const handleClick = async () => {
    try {
      const result = await signIn("github", { callbackUrl: "/builder" });
      if (result?.error) {
        console.error("Sign in error:", result.error);
      } else {
        router.push("/builder");
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };
  return (
    <Container
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      })}
      maxW="7xl"
    >
      <Button size="md" onClick={handleClick}>
        Launch website builder
      </Button>
    </Container>
  );
}
