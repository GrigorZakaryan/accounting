import { Separator } from "@/components/ui/separator";
import HeroDashboard from "@/public/hero-dashboard.png";
import InvoicePayment from "@/public/invoice-payment.png";
import Purchases from "@/public/purchases.png";
import Logo from "@/public/Logo.svg";

import CoAs from "@/public/CoAs.png";
import Sales from "@/public/sales.png";
import QuickActionsImg from "@/public/quick-actions.png";

import noisy from "../public/noisy-bg.svg";

import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  return (
    <main className="w-full h-full overflow-x-hidden">
      <div className="px-[20px] lg:px-[100px]">
        <header className="flex items-center justify-center border-x border-green-500/20 py-5 px-5">
          <div className="flex items-center justify-between p-1 w-full max-w-[700px] border-[1px] border-green-700 bg-green-100 rounded-full">
            <Image width={35} height={35} alt="Logo" src={Logo.src} />
            <ul className="hidden lg:flex items-center gap-5">
              <li className="cursor-pointer">About</li>
              <li className="cursor-pointer">Blog</li>
              <li className="cursor-pointer">Pricing</li>
              <li className="cursor-pointer">Features</li>
            </ul>
            <button className="bg-gradient-to-br from-[#00B21B] via-[#006610] hover:via-[#004C0B] to-[#00600E] w-[100px] py-2 text-white rounded-full text-sm font-medium duration-200 cursor-pointer">
              Try Demo
            </button>
          </div>
        </header>
      </div>
      <Separator className="bg-green-500/20 relative">
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] left-[16px] lg:left-[96px]" />
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] right-[16px] lg:right-[96px]" />
      </Separator>
      <section className="px-[20px] lg:px-[100px] h-full">
        <div className="flex justify-center border-x border-green-500/20">
          <div className="flex flex-col items-center gap-5 mt-[100px] w-full max-w-[330px] lg:max-w-[700px]">
            <h1 className="text-5xl lg:text-6xl font-medium text-center bg-clip-text bg-gradient-to-br from-[#039F19] via-[#013909] to-[#039F19] text-transparent">
              Smart tools for growing <br />
              your business
            </h1>
            <p className="text-sm lg:text-md text-center">
              Provide a short overview of your platform’s purpose. Highlight how
              your financial tools are designed to help businesses or
              individuals optimize their financial decisions.
            </p>
            <div className="flex items-center gap-5 mt-10 relative z-10">
              <button className="bg-white w-[150px] py-2.5 text-green-900 rounded-full font-medium cursor-pointer opacity-80 hover:opacity-100">
                Join Waitlist
              </button>
              <Link href={"/overview"}>
                <button className="bg-gradient-to-br from-[#00B21B] via-[#006610] hover:via-[#004C0B] to-[#00600E] w-[150px] py-2.5 text-white rounded-full font-medium duration-200 cursor-pointer">
                  Try Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center relative w-full lg:py-[150px] border-x border-green-500/20">
          <Image
            width={300}
            height={300}
            alt="Hero"
            src={Purchases.src}
            className="absolute z-99 rounded-sm lg:rounded-xl drop-shadow-xl rotate-6 -left-10 lg:left-20 w-[150px] lg:w-[300px] object-cover"
          />
          <Image
            width={700}
            height={500}
            alt="Hero"
            src={HeroDashboard.src}
            className="absolute z-90 rounded-lg lg:rounded-2xl w-[300px] lg:w-[700px] object-cover"
          />
          <Image
            width={300}
            height={300}
            alt="Hero"
            src={InvoicePayment.src}
            className="absolute z-99 rounded-lg lg:rounded-2xl drop-shadow-xl -rotate-3 -right-20 lg:right-20 w-[150px]  lg:w-[300px]"
          />
          <div className="bg-[#00A219] w-[900px] h-[400px] rounded-full trasnform translate-z-0 blur-[200px]" />
        </div>
      </section>
      <Separator className="bg-green-500/20 relative lg:mt-[200px]">
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] left-[16px] lg:left-[96px]" />
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] right-[16px] lg:right-[96px]" />
      </Separator>
      <section className="px-[20px] lg:px-[100px]">
        <div className="flex justify-center border-x border-green-500/20">
          <div className="flex flex-col items-center gap-5 mt-[100px] w-full max-w-[350px] lg:max-w-[500px]">
            <h1 className="text-4xl lg:text-5xl font-medium text-center bg-clip-text bg-gradient-to-br from-[#039F19] via-[#013909] to-[#039F19] text-transparent">
              Features that shape <br />
              your business
            </h1>
            <p className="text-xs lg:text-sm text-center">
              Provide a short overview of your platform’s purpose. Highlight how
              your financial tools are designed to help businesses or
              individuals.
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-7 pt-16 px-2 lg:px-10 border-x border-green-500/20">
          <div className="w-full h-[400px] bg-white drop-shadow-[#00600E]/10 drop-shadow-2xl rounded-3xl p-3">
            <Image
              width={400}
              height={255}
              alt="Coa"
              src={CoAs.src}
              className="w-full rounded-3xl drop-shadow-xl h-[255px] object-cover"
            />
            <div className="mt-10">
              <h1 className="text-xl font-semibold text-green-900">
                Intuitive drag & drop editor
              </h1>
              <p className="text-sm font-medium text-green-900 mt-1">
                Create stunning designs effortlessly with a user-friendly
                interface.
              </p>
            </div>
          </div>
          <div className="w-full h-[400px] bg-white drop-shadow-[#00600E]/10 drop-shadow-2xl rounded-3xl p-3">
            <Image
              width={400}
              height={255}
              alt="Coa"
              src={Sales.src}
              className="w-full rounded-3xl drop-shadow-xl h-[255px] object-cover object-top"
            />
            <div className="mt-10">
              <h1 className="text-xl font-semibold text-green-900">
                Intuitive drag & drop editor
              </h1>
              <p className="text-sm font-medium text-green-900 mt-1">
                Create stunning designs effortlessly with a user-friendly
                interface.
              </p>
            </div>
          </div>
          <div className="w-full h-[400px] bg-white drop-shadow-[#00600E]/10 drop-shadow-2xl rounded-3xl p-3">
            <Image
              width={400}
              height={255}
              alt="Coa"
              src={QuickActionsImg.src}
              className="w-full rounded-3xl drop-shadow-xl h-[255px] object-cover object-top"
            />
            <div className="mt-10">
              <h1 className="text-xl font-semibold text-green-900">
                Intuitive drag & drop editor
              </h1>
              <p className="text-sm text-green-900 font-medium mt-1">
                Create stunning designs effortlessly with a user-friendly
                interface.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-[20px] lg:px-[100px]">
        <div className="border-x border-green-500/20 px-2 lg:px-10 py-[200px]">
          <div className="w-full h-[400px] bg-gradient-to-b from-[#039F19] to-[#C0FFC9] rounded-2xl relative overflow-hidden">
            <Image
              width={1000}
              height={1000}
              alt="noisy"
              src={noisy.src}
              className="w-full opacity-10 h-full object-cover absolute z-1"
            />
            <div>
              <div className="lg:px-10 pt-20">
                <div className="flex flex-col items-center lg:block lg:absolute w-full max-w-full lg:max-w-[55%] z-10">
                  <h1 className="text-white text-3xl lg:text-5xl font-semibold text-center lg:text-left">
                    Smart tools for growing <br />
                    your business
                  </h1>
                  <p className="text-center lg:text-left text-xs lg:text-sm text-white mt-4 px-3 lg:px-0">
                    Provide a short overview of your platform’s purpose.
                    Highlight how your financial tools are designed to help
                    businesses or individuals optimize their financial
                    decisions.
                  </p>
                  <div className="flex items-center gap-5 mt-10">
                    <button className="bg-white w-[150px] py-2.5 text-green-900 rounded-full font-medium cursor-pointer opacity-80 hover:opacity-100">
                      Join Waitlist
                    </button>
                    <Link href={"/overview"}>
                      <button className="bg-gradient-to-br from-[#00B21B] via-[#006610] hover:via-[#004C0B] to-[#00600E] w-[150px] py-2.5 text-white rounded-full font-medium duration-200 cursor-pointer">
                        Try Demo
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <Image
                width={800}
                height={800}
                alt="hero"
                src={HeroDashboard.src}
                className="hidden lg:block lg:absolute z-11 w-[600px] rounded-2xl -right-30 -bottom-5"
              />
            </div>
          </div>
        </div>
      </section>
      <Separator className="bg-green-500/20 relative">
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] left-[16px] lg:left-[96px]" />
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] right-[16px] lg:right-[96px]" />
      </Separator>
      <footer className="flex flex-col px-[20px] lg:px-[100px] text-green-900">
        <div className="grid grid-cols-2 lg:grid-cols-3 border-x border-green-500/20 p-10">
          <div className="w-full text-left">
            <h1 className="text-2xl font-medium">About</h1>
            <div className="flex flex-col gap-3 mt-5">
              <div className="flex flex-col">
                <h2 className="font-medium">E-mail</h2>
                <span>grigzaqaryan85@gmail.com</span>
              </div>
              <div>
                <h2 className="font-medium">Phone</h2>
                <span>+39 377 099 6675</span>
              </div>
            </div>
          </div>
          <div className="w-full text-right lg:text-center">
            <h1 className="text-2xl font-medium">Links</h1>
            <div className="flex flex-col gap-3 mt-5">
              <Link href={"#"}>Home</Link>
              <Link href={"#"}>Blog</Link>
              <Link href={"#"}>Pricing</Link>
              <Link href={"#"}>Features</Link>
            </div>
          </div>
          <div className="w-full text-left lg:text-right">
            <h1 className="text-2xl font-medium">Social Meida</h1>
            <div className="flex flex-col gap-3 mt-5">
              <Link href={"#"}>Instagram</Link>
              <Link href={"#"}>LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
      <Separator className="bg-green-500/20 relative">
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] left-[16px] lg:left-[96px]" />
        <div className="w-2 h-2 bg-green-800 absolute top-[50%] translate-y-[-50%] right-[16px] lg:right-[96px]" />
      </Separator>
      <div className="w-full px-[20px] lg:px-[100px]">
        <div className="flex items-center justify-center border-x border-green-500/20 py-5">
          <span className="text-xs lg:text-sm text-green-900">
            © 2025 All rights reserved. Built with ❤️ by{" "}
            <span className="font-medium underline cursor-pointer">
              zakaweb
            </span>
            .
          </span>
        </div>
      </div>
    </main>
  );
}
