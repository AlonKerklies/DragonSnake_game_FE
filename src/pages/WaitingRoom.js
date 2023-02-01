import React from "react";
import io from "socket.io-client";
import MPGamepage from "./MPGamepage";

const socket = io(
    process.env.REACT_APP_SERVER_URL,
    { transports: ["websocket"] },
    { withCredentials: true }
);

const WaitingRoom = () => {
    const [roomId, setRoomId] = React.useState(null);
    const [joinRoomId, setJoinRoomId] = React.useState("");
    const [users, setUsers] = React.useState([]);
    // const [gameStarted, setGameStarted] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [cells, setCells] = React.useState(null);

    // emit "send key" on "kenydown"
    //   React.useEffect(() => {
    //     window.addEventListener("keydown", (e) => {
    //       socket.emit("send key", {key: e.key, roomId: roomId});
    //     });
    //     return () => {
    //       window.removeEventListener("keydown", (e) => {
    //         socket.emit("send key", {key: e.key, roomId: roomId});
    //       });
    //     };
    //   }, []);

    // Idk if this should go in a useEffect or not
    //   React.useEffect(() => {
    socket.on("user joined", (userId) => {
        setUsers([...users, userId]);
    });
    socket.on("game started", (cells) => {
        setCells(cells);
        // navigate("/MPgamepage");
    });
    // socket.on("room created", (id) => {
    //     setRoomId(id);
    // });
    socket.on("roomId", (id) => {
        setRoomId(id);
    });
    //   socket.on("received key", (key) => {
    //     console.log("received key:", key);
    //     setKeys((keys) => [...keys, key]);
    //   });
    //   }, [users, gameStarted, roomId]);

    const handleCreateRoom = () => {
        socket.emit("create room");
    };

    const handleJoinRoom = () => {
        socket.emit("join room", joinRoomId);
    };

    const handleStartGame = () => {
        socket.emit("start game", roomId);
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <div style={{ textAlign: "center" }}>
            {cells && (
                <>
                    <p>Game started!</p>
                    <MPGamepage initialCells={cells} socket={socket} />
                </>
            )}
            {roomId ? (
                <>
                    <p onClick={copyRoomId}>
                        Room ID ({copied ? "Copied!" : "Click to copy"}):{" "}
                        {roomId}
                    </p>
                    <p>Users in room: {users.join(", ")}</p>
                    <button onClick={handleStartGame}>Start Game</button>
                </>
            ) : (
                <>
                    <button onClick={handleCreateRoom}>Create Room</button>
                    <br />
                    <br />
                    <p>Or</p>
                    <br />
                    <p>
                        <label htmlFor="join-room-input">Enter Room ID:</label>
                        <br />
                        <input
                            id="join-room-input"
                            type="text"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                        />
                    </p>
                    <button
                        disabled={joinRoomId.length < 5}
                        onClick={handleJoinRoom}
                    >
                        Join Room
                    </button>
                </>
            )}
        </div>
    );
};

export default WaitingRoom;
