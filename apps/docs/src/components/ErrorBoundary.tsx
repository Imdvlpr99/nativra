import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  /** What failed, e.g. "this page" or "the source code" */
  label?: string;
  /** Clears the error when it changes (e.g. the pathname), without remounting the children */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

/**
 * Contains a failed render (for example an item that couldn't be fetched) to its own section
 * instead of blanking the whole page, and offers a retry.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error(error);
  }

  override componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  private retry = () => this.setState({ error: null });

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
          Couldn&apos;t load {this.props.label ?? "this section"}.
        </p>
        <p className="text-muted-foreground">Check your connection, then try again.</p>
        <button type="button" onClick={this.retry} className="btn-secondary h-9">
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }
}
