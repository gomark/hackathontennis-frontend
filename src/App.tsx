import { Button } from "@/components/ui/button"
import { useState } from "react"
 
function App() {
  const [response, setResponse] = useState<string>("")
  
  const handleClick = async () => {
    try {
      const res = await fetch('/first/hello')
      const text = await res.text()
      setResponse(text)
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={handleClick}>Click me</Button>
      {response && <p className="mt-4">{response}</p>}
    </div>
  )
}
 
export default App