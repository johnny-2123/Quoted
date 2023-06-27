import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function User() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <>
      <div>
        <h1 className="text-3xl py-2">User</h1>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="duration-300 hover:pl-2 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  );
}
