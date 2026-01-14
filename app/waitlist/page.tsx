"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createUser } from "@/lib/actions/AddUser";
import { useActionState } from "react";

export default function WaitlistForm() {
  const [state, formAction] = useActionState(createUser, null);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full max-w-4xl space-y-12 md:space-y-16">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-7xl md:text-8xl font-black  bg-clip-text bg-linear-to-r from-primary via-accent to-secondary">
                GISTLY
              </h1>
              <p className="text-xl md:text-2xl text-accent font-bold tracking-wide">
                Nigeria's Digital Town Square
              </p>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Where Nigerians drop their gists, connect with real people, and do
              business with trust. Pure vibes. Real community. No cap.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50">
              <CardHeader>
                <CardTitle>
                  {" "}
                  <div className="text-5xl">🎤</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Drop Your Gist
                  </h3>
                  <p className="text-muted-foreground">
                    Voice, text, or mix it up. This is your real talk platform.
                    No filters, pure Nigerian energy.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50">
              <CardHeader>
                <CardTitle>
                  <div className="text-5xl">👥</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Connect with Nigerians
                  </h3>
                  <p className="text-muted-foreground">
                    VFind your people, build real community, make connections
                    that matter. Area by area, interest by interest.
                  </p>
                </div>
              </CardContent>
            </Card>{" "}
            <Card className="hover:border-primary/50">
              <CardHeader>
                <CardTitle>
                  {" "}
                  <div className="text-5xl">🛒</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Buy & Sell Smart
                  </h3>
                  <p className="text-muted-foreground">
                    Secure marketplace with escrow protection. No scam, no
                    wahala. Support Nigerian businesses and creators.
                  </p>
                </div>
              </CardContent>
            </Card>{" "}
            <Card className="hover:border-primary/50">
              <CardHeader>
                <CardTitle>
                  {" "}
                  <div className="text-5xl">📱</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Data-Friendly Design
                  </h3>
                  <p className="text-muted-foreground">
                    Voice, text, or mix it up. This is your real talk platform.
                    No filters, pure Nigerian energy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="hover:border-primary/50">
            <CardHeader>
              <CardTitle className="text-5xl">Be First on the Gist</CardTitle>
              <p className="text-lg text-accent font-semibold">
                Get early access and claim your "OG" status
              </p>
            </CardHeader>

            <CardContent>
              <form action={formAction} className="space-y-5">
                {state?.success && (
                  <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                    {state.message}
                  </div>
                )}
                {state?.success === false && (
                  <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
                    {state.message}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    What's your name?
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Where did you hear about us?
                  </label>
                  <input
                    type="text"
                    name="source"
                    required
                    placeholder="e.g., Twitter, Friend, etc."
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email for updates
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Checkbox name="notify" />
                <label className="ml-2">Do you want to be notified?</label>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
                >
                  Join Early Access
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
