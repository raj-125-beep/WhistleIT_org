import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils } from "@project-serum/anchor";
import idl from "./idl.json"; // Your generated IDL

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const provider = new AnchorProvider(
  connection,
  window.solana, // Phantom wallet
  { preflightCommitment: "confirmed" }
);

const programId = new PublicKey("YOUR_PROGRAM_ID_HERE");
const program = new Program(idl, programId, provider);

async function submitCaseToChain(title, category, description) {
  const [caseAccount, bump] = await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode(title), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  await program.methods
    .submitCase(title, category, description)
    .accounts({
      case: caseAccount,
      user: provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();

  console.log("✅ Case submitted to Solana Devnet:", caseAccount.toString());
}
