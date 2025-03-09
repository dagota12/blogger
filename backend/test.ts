import bcrypt from "bcrypt";

console.log(bcrypt.hashSync("alex", 10));
console.log(
  bcrypt.compareSync(
    "abe",
    "$2b$10$GpML2/q6.Zzay3UDBS3wQ.aQ7G.at599hise3bHTeybGnLPw1Svxu"
  )
);
