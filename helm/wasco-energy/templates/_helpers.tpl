{{/*
Expand the name of the chart.
*/}}
{{- define "wasco-energy.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "wasco-energy.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels.
*/}}
{{- define "wasco-energy.labels" -}}
helm.sh/chart: {{ include "wasco-energy.chart" . }}
app.kubernetes.io/name: {{ include "wasco-energy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "wasco-energy.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{- define "wasco-energy.selectorLabels" -}}
app.kubernetes.io/name: {{ include "wasco-energy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "wasco-energy.frontendName" -}}
{{- printf "%s-frontend" (include "wasco-energy.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "wasco-energy.backendName" -}}
{{- printf "%s-backend" (include "wasco-energy.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "wasco-energy.mongodbName" -}}
{{- printf "%s-mongodb" (include "wasco-energy.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "wasco-energy.publicScheme" -}}
{{- if or (and .Values.ingress.enabled .Values.ingress.tls.enabled) (and .Values.route.enabled .Values.route.tls.enabled) (and .Values.openshift.route.enabled .Values.openshift.route.tls.enabled) -}}https{{- else -}}http{{- end -}}
{{- end -}}

{{- define "wasco-energy.publicUrl" -}}
{{- if .Values.route.enabled -}}
{{- printf "%s://%s" (include "wasco-energy.publicScheme" .) (required "route.host is required when route.enabled=true" .Values.route.host) -}}
{{- else if .Values.openshift.route.enabled -}}
{{- printf "%s://%s" (include "wasco-energy.publicScheme" .) .Values.ingress.host -}}
{{- else if .Values.ingress.enabled -}}
{{- printf "%s://%s" (include "wasco-energy.publicScheme" .) .Values.ingress.host -}}
{{- else -}}
http://localhost:3000
{{- end -}}
{{- end -}}

{{- define "wasco-energy.mongodbUri" -}}
{{- if .Values.mongodb.enabled -}}
{{- printf "mongodb://%s:%v/%s" (include "wasco-energy.mongodbName" .) .Values.mongodb.service.port .Values.mongodb.database -}}
{{- else -}}
{{- required "externalMongodb.uri is required when mongodb.enabled=false and externalMongodb.existingSecret is empty" .Values.externalMongodb.uri -}}
{{- end -}}
{{- end -}}
