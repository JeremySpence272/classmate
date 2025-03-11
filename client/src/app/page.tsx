import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-4xl font-extrabold">Hello World</h1>
        <Button className="cursor-pointer mt-4">Click me</Button>
      </main>
    </>
  )
}
