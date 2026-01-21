

import React from "react";

export default function DiscoverScreen() {
  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Discover page</h1>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5"
  },
  text: {
    fontSize: "2rem",
    fontFamily: "sans-serif",
    color: "#333"
  }
};



