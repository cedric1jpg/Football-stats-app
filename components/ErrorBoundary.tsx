import React from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ padding: 24 }}>
          <h3>Something went wrong</h3>
          <div className="subtitle">An unexpected error occurred. Try reloading the page.</div>
        </div>
      )
    }
    return this.props.children as React.ReactElement
  }
}
