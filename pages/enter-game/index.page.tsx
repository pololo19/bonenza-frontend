import Loader from "@/components/common/preloader/loader";
import BaseLayout from "@/components/layouts/base.layout";
import cn from "classnames";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

function EnterGame() {

    const [isLoading, setIsLoading] = useState(false);
    const { query, reload } = useRouter();
    const { gameUrl, gameLauncherUrl, lobbyUrl, tokenId, strategy } = query;

    const onSuccess = () => {
        setIsLoading(false)
    }

    const onError = () => {
        setIsLoading(false);
    }

    const launchGame = (gameUrl: string, launcherUrl: string, strategy: string, lobbyUrl: string, tokenId: string, onSuccess: Function, onError: Function) => {
        try {
            const list = document.getElementById('game_wrapper_mobile');
            if (list?.firstElementChild) {
                list?.removeChild(list?.firstElementChild);
            }

            const gameLaunchOptions = {
                target_element: 'game_wrapper_mobile',
                launch_options: {

                    // Required
                    game_launcher_url: launcherUrl, // URL to GameLauncher HTML page

                    // Game parameters. Required.
                    game_url: gameUrl,
                    strategy: strategy,
                    lobby_url: lobbyUrl,
                    token_id: tokenId,
                    // The number of game parameters depends on 'strategy'.
                },
            };
            window.sg.launch(gameLaunchOptions, onSuccess, onError);
        } catch (error) {
            console.log(error)
        } finally {
            onError();
        }
    };

    useEffect(() => {
        if (gameUrl && strategy) {
            const _src = String(gameUrl);
            const _launcher = String(gameLauncherUrl);
            const _lobby = String(lobbyUrl);
            const _token = String(tokenId);
            const _mode = String(strategy);
            console.log(_src, decodeURIComponent(_src), "======58")
            launchGame(decodeURIComponent(_src), decodeURIComponent(_launcher), decodeURIComponent(_mode), decodeURIComponent(_lobby), decodeURIComponent(_token), onSuccess, onError)

        }
    }, [gameUrl, gameLauncherUrl, lobbyUrl, tokenId, strategy])


    return (
        <>
            {isLoading && <Loader />}
            <div className="fixed w-screen max-h-screen h-full p-1">
                <div
                    id="game_wrapper_mobile"
                    className={cn(
                        'h-full sm:dark:bg-black dark:bg-color-modal-bg-primary bg-white rounded-large'
                    )}
                />
            </div>
        </>

    )
}
export default EnterGame;