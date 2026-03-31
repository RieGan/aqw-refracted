export async function checkWebGPU() {
  if (!navigator.gpu) {
    console.error('WebGPU is not supported or not enabled via flags.')
    return
  }

  const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
  if (adapter) {
    console.log('Success! WebGPU Adapter found:', adapter)
  } else {
    console.error('WebGPU is supported, but no GPU adapter was found.')
  }
}
