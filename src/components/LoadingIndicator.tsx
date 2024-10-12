import { Component } from "solid-js";

const LoadingIndicator: Component = () => {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex items-center">
        <span class="loading loading-dots loading-l"></span>
      </div>
    </div>
  );
};

export default LoadingIndicator;