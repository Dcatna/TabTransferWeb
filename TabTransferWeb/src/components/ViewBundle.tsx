import { GetTabBudleByID } from "@/data/supabaseclient";
import { ExportedBundle } from "@/data/Types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const ViewBundle = () => {
    const { bundleId } = useParams()
    const navigate = useNavigate()
    const [bundle, setBundle] = useState<ExportedBundle | null>(null)

    useEffect(() => {
        async function getBundle() {
            if (bundleId) {
                const res = await GetTabBudleByID(bundleId)
                console.log("Fetched Bundle:", res)
                setBundle(res)
            }
        }

        getBundle()
    }, [bundleId])

    function handleRestoreTabs() {
        bundle?.urls?.forEach((tab) => {
            const newTab = window.open("", "_blank");
        
            if (newTab) {
              newTab.location.href = tab.url;
            } else {
              console.error("Popup blocked!");
            }
          });
    }

    return (
        <div className="min-h-screen bg-background p-6 w-full overflow-x-auto">
            <div className="p-6 shadow-md rounded-lg bg-card flex justify-between items-center">
                <Button onClick={() => navigate("/home")} className="font-bold">
                    ← Back
                </Button>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{bundle?.bundle_id || "Loading..."}</h1>
                    <p className="text-card-foreground text-sm">
                        Created at: {bundle ? new Date(bundle.created_at).toLocaleString() : "Loading..."}
                    </p>
                </div>
                {bundle && (
                    <Button onClick={handleRestoreTabs} className="bg-primary shadow-md">
                        Restore Tabs
                    </Button>
                )}
            </div>

            <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Tabs</h3>
                {bundle && bundle.urls?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bundle.urls.map((tab, index) => (
                            <div key={index} className="bg-card p-4 shadow-md rounded-lg flex flex-col space-y-2">
                                <div className="flex items-center space-x-4">
                                    {tab.favicon_url && (
                                        <img src={tab.favicon_url} alt="" className="w-8 h-8 flex-shrink-0" />
                                    )}
                                    <span className="flex-1 truncate font-medium">{tab.title || "Untitled Tab"}</span>
                                </div>
                                <a
                                    href={tab.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-primary hover:underline"
                                >
                                    {tab.url}
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No tabs found in this bundle.</p>
                )}
            </div>
        </div>
    );
};

export default ViewBundle;
