import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const page = () => {
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
                    VFind your people, build real community, make connections that matter. Area by area, interest by interest.
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
                    Secure marketplace with escrow protection. No scam, no wahala. Support Nigerian businesses and creators.
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
        </div>
      </div>
    </div>
  )
}

export default page