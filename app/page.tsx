import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div>
        <ul className="flex space-x-4 text-xl ">
          <li className=" border-2 rounded-lg p-2 text-black hover:bg-blue-500 hover:text-white bg-gray-100">
            <Link href={"factory"}>Factory Mode</Link>
          </li>
          <li className="border-2 rounded-lg p-2 text-black hover:bg-blue-500 hover:text-white bg-gray-100">
            <Link href={"school"}>School</Link>
          </li>
          <li className="border-2 rounded-lg p-2 text-black hover:bg-blue-500 hover:text-white bg-gray-100">
            <Link href={"register"}>Register</Link>
          </li>
          <li className="border-2 rounded-lg p-2 text-black hover:bg-blue-500 hover:text-white bg-gray-100">
            <Link href={"login"}>Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
